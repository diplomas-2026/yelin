package com.github.danbel.yelinapi.service;

import com.github.danbel.yelinapi.dto.DocumentDtos.DocumentRequest;
import com.github.danbel.yelinapi.dto.DocumentDtos.DocumentResponse;
import com.github.danbel.yelinapi.model.Document;
import com.github.danbel.yelinapi.model.User;
import com.github.danbel.yelinapi.repository.DocumentRepository;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
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

    public DocumentResponse create(DocumentRequest request, User user) {
        Long id = documentRepository.create(normalize(request, user.id()));
        return findById(id);
    }

    public DocumentResponse update(Long id, DocumentRequest request, User user) {
        Document current = documentRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Документ не найден"));
        Long uploadedBy = request.uploadedBy() == null ? current.uploadedBy() : user.id();
        documentRepository.update(id, normalize(request, uploadedBy));
        return findById(id);
    }

    public DownloadedDocument download(Long id) {
        Document document = documentRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Документ не найден"));
        String body = """
                Демонстрационный файл проектной документации

                Документ: %s
                Файл: %s
                Версия: %d
                Статус: %s
                """.formatted(document.name(), document.fileName(), document.version(), document.status());
        return new DownloadedDocument(document.fileName(), body.getBytes(StandardCharsets.UTF_8));
    }

    public void delete(Long id) {
        documentRepository.delete(id);
    }

    private DocumentRequest normalize(DocumentRequest request, Long uploadedBy) {
        return new DocumentRequest(
                request.projectId(),
                request.name(),
                request.type(),
                request.fileName(),
                request.version() == null ? 1 : request.version(),
                request.status() == null || request.status().isBlank() ? "В работе" : request.status(),
                uploadedBy,
                request.comment()
        );
    }

    public record DownloadedDocument(String fileName, byte[] content) {}

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
                document.version(),
                document.status(),
                document.uploadedBy(),
                uploader.fullName(),
                document.uploadedAt(),
                document.comment()
        );
    }
}
