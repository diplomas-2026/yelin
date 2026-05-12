package com.github.danbel.yelinapi.service;

import com.github.danbel.yelinapi.dto.DocumentDtos.DocumentResponse;
import com.github.danbel.yelinapi.model.Document;
import com.github.danbel.yelinapi.model.User;
import com.github.danbel.yelinapi.repository.DocumentRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Locale;
import java.util.List;

@Service
public class DocumentService {
    private final DocumentRepository documentRepository;
    private final ProjectService projectService;
    private final UserService userService;

    public DocumentService(DocumentRepository documentRepository, ProjectService projectService, UserService userService) {
        this.documentRepository = documentRepository;
        this.projectService = projectService;
        this.userService = userService;
    }

    public List<DocumentResponse> findAll(Long projectId) {
        List<Document> documents = projectId == null ? documentRepository.findAll() : documentRepository.findByProjectId(projectId);
        return documents.stream().map(this::toResponse).toList();
    }

    public DocumentResponse findById(Long id) {
        return toResponse(documentRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Документ не найден")));
    }

    public DocumentResponse create(Long projectId, MultipartFile file, String comment, User user) {
        UploadedFile uploadedFile = toUploadedFile(file);
        Long id = documentRepository.create(
                projectId,
                uploadedFile.name(),
                uploadedFile.type(),
                uploadedFile.fileName(),
                uploadedFile.mimeType(),
                uploadedFile.content(),
                user.id(),
                comment
        );
        return findById(id);
    }

    public DocumentResponse update(Long id, Long projectId, MultipartFile file, String comment, User user) {
        Document current = documentRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Документ не найден"));
        UploadedFile uploadedFile = file != null && !file.isEmpty() ? toUploadedFile(file) : null;
        documentRepository.update(
                id,
                projectId,
                uploadedFile != null ? uploadedFile.name() : current.name(),
                uploadedFile != null ? uploadedFile.type() : current.type(),
                uploadedFile != null ? uploadedFile.fileName() : current.fileName(),
                uploadedFile != null ? uploadedFile.mimeType() : current.mimeType(),
                uploadedFile != null ? uploadedFile.content() : null,
                user.id(),
                comment
        );
        return findById(id);
    }

    public DownloadedDocument download(Long id) {
        Document document = documentRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Документ не найден"));
        byte[] content = document.fileContent();
        if (content == null || content.length == 0) {
            content = ("Документ: " + document.name()).getBytes();
        }
        return new DownloadedDocument(document.fileName(), document.mimeType() == null ? "application/octet-stream" : document.mimeType(), content);
    }

    public void delete(Long id) {
        documentRepository.delete(id);
    }

    private UploadedFile toUploadedFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Файл обязателен");
        }
        String originalName = file.getOriginalFilename();
        if (originalName == null || originalName.isBlank()) {
            originalName = "document";
        }
        String fileName = originalName.substring(Math.max(originalName.lastIndexOf('/'), originalName.lastIndexOf('\\')) + 1);
        String baseName = fileName.contains(".") ? fileName.substring(0, fileName.lastIndexOf('.')) : fileName;
        String extension = fileName.contains(".") ? fileName.substring(fileName.lastIndexOf('.') + 1) : "FILE";
        try {
            return new UploadedFile(
                    baseName.replace('_', ' '),
                    extension.toUpperCase(Locale.ROOT),
                    fileName,
                    file.getContentType() == null ? "application/octet-stream" : file.getContentType(),
                    file.getBytes()
            );
        } catch (IOException exception) {
            throw new IllegalArgumentException("Не удалось прочитать файл");
        }
    }

    public record DownloadedDocument(String fileName, String mimeType, byte[] content) {}

    private record UploadedFile(String name, String type, String fileName, String mimeType, byte[] content) {}

    private DocumentResponse toResponse(Document document) {
        var project = projectService.getProject(document.projectId());
        var uploader = userService.getUser(document.uploadedBy());
        return new DocumentResponse(
                document.id(),
                document.projectId(),
                project.name(),
                document.name(),
                document.type(),
                document.fileName(),
                document.mimeType(),
                document.version(),
                document.status(),
                document.uploadedBy(),
                uploader.fullName(),
                document.uploadedAt(),
                document.comment()
        );
    }
}
