package com.github.danbel.yelinapi.controller;

import com.github.danbel.yelinapi.dto.DocumentDtos.DocumentRequest;
import com.github.danbel.yelinapi.dto.DocumentDtos.DocumentResponse;
import com.github.danbel.yelinapi.service.DocumentService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/documents")
public class DocumentController {
    private final DocumentService documentService;

    public DocumentController(DocumentService documentService) {
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

    @PostMapping
    public DocumentResponse create(@RequestBody DocumentRequest request) {
        return documentService.create(request);
    }

    @PutMapping("/{id}")
    public DocumentResponse update(@PathVariable Long id, @RequestBody DocumentRequest request) {
        return documentService.update(id, request);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        documentService.delete(id);
    }
}
