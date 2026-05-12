package com.github.danbel.yelinapi.controller;

import com.github.danbel.yelinapi.dto.DocumentDtos.DocumentResponse;
import com.github.danbel.yelinapi.service.DocumentService;
import com.github.danbel.yelinapi.service.UserService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/documents")
public class DocumentController extends CurrentUserSupport {
    private final DocumentService documentService;

    public DocumentController(DocumentService documentService, UserService userService) {
        super(userService);
        this.documentService = documentService;
    }

    @GetMapping
    public List<DocumentResponse> findAll(@RequestParam(required = false) Long projectId) {
        return documentService.findAll(projectId);
    }

    @GetMapping("/{id}")
    public DocumentResponse findById(@PathVariable Long id) {
        return documentService.findById(id);
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public DocumentResponse create(
            @RequestParam Long projectId,
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "comment", required = false) String comment,
            Authentication authentication
    ) {
        return documentService.create(projectId, file, comment, currentUser(authentication));
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public DocumentResponse update(
            @PathVariable Long id,
            @RequestParam Long projectId,
            @RequestParam(value = "file", required = false) MultipartFile file,
            @RequestParam(value = "comment", required = false) String comment,
            Authentication authentication
    ) {
        return documentService.update(id, projectId, file, comment, currentUser(authentication));
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<byte[]> download(@PathVariable Long id) {
        var document = documentService.download(id);
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(document.mimeType()))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + document.fileName() + "\"")
                .body(document.content());
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        documentService.delete(id);
    }
}
