package com.github.danbel.yelinapi.controller;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping
public class DemoCatalogController {

    private static final List<UserDto> USERS = List.of(
            new UserDto(1L, "Иванов Иван Иванович", "admin@max-arh.local", "ADMIN", "Администратор", true, LocalDateTime.of(2026, 5, 1, 9, 0)),
            new UserDto(2L, "Петров Петр Петрович", "manager@max-arh.local", "PROJECT_MANAGER", "Руководитель проекта", true, LocalDateTime.of(2026, 5, 1, 9, 5)),
            new UserDto(3L, "Сидоров Сергей Сергеевич", "architect@max-arh.local", "EXECUTOR", "Архитектор", true, LocalDateTime.of(2026, 5, 1, 9, 10)),
            new UserDto(4L, "Кузнецова Анна Андреевна", "reviewer@max-arh.local", "REVIEWER", "Проверяющий", true, LocalDateTime.of(2026, 5, 1, 9, 15))
    );

    private static final List<ProjectDto> PROJECTS = List.of(
            new ProjectDto(
                    1L,
                    "Многоэтажный жилой дом",
                    "Жилой комплекс с подземным паркингом",
                    "ООО «ГрадСтрой»",
                    "г. Самара, ул. Лесная, 12",
                    "Жилое здание",
                    2L,
                    "Петров Петр Петрович",
                    "Проектная документация",
                    "В работе",
                    50,
                    LocalDate.of(2026, 5, 1),
                    LocalDate.of(2026, 9, 15),
                    null,
                    2
            ),
            new ProjectDto(
                    2L,
                    "Административное здание",
                    "Офисный комплекс для регионального офиса",
                    "АО «РегионИнвест»",
                    "г. Самара, ул. Набережная, 41",
                    "Административное здание",
                    2L,
                    "Петров Петр Петрович",
                    "Эскизный проект",
                    "На проверке",
                    33,
                    LocalDate.of(2026, 4, 18),
                    LocalDate.of(2026, 8, 30),
                    null,
                    1
            ),
            new ProjectDto(
                    3L,
                    "Реконструкция общественного здания",
                    "Капитальная реконструкция объекта культуры",
                    "МБУК «Центр культуры»",
                    "г. Тольятти, проспект Победы, 8",
                    "Реконструкция",
                    2L,
                    "Петров Петр Петрович",
                    "Рабочая документация",
                    "Просрочен",
                    66,
                    LocalDate.of(2026, 3, 10),
                    LocalDate.of(2026, 5, 10),
                    null,
                    2
            )
    );

    private static final List<DashboardDeadlineDto> DEADLINES = List.of(
            new DashboardDeadlineDto(1L, "Многоэтажный жилой дом", "Проектная документация", "Сидоров Сергей Сергеевич", LocalDate.of(2026, 6, 20), 40),
            new DashboardDeadlineDto(2L, "Административное здание", "Эскизный проект", "Сидоров Сергей Сергеевич", LocalDate.of(2026, 5, 20), 8),
            new DashboardDeadlineDto(3L, "Реконструкция общественного здания", "Рабочая документация", "Сидоров Сергей Сергеевич", LocalDate.of(2026, 5, 10), -1)
    );

    private static final List<DocumentReviewDto> REVIEW_DOCS = List.of(
            new DocumentReviewDto(1L, "План 1 этажа", "Многоэтажный жилой дом", "Проектная документация", "Пояснительная записка", 2, "Сидоров Сергей Сергеевич", LocalDateTime.of(2026, 5, 12, 15, 10), "На проверке", 2),
            new DocumentReviewDto(2L, "Фасад главный", "Административное здание", "Эскизный проект", "Фасад", 1, "Сидоров Сергей Сергеевич", LocalDateTime.of(2026, 5, 11, 14, 20), "На проверке", 1),
            new DocumentReviewDto(3L, "Архитектурные решения", "Реконструкция общественного здания", "Проектная документация", "Архитектурные решения", 3, "Сидоров Сергей Сергеевич", LocalDateTime.of(2026, 5, 11, 9, 10), "На повторной проверке", 2)
    );

    private static final List<NotificationDto> NOTIFICATIONS = List.of(
            new NotificationDto(1L, "Вам назначен этап «Проектная документация».", "/projects/1/stages/3", false, LocalDateTime.of(2026, 5, 12, 8, 0)),
            new NotificationDto(2L, "Документ «План 1 этажа» отправлен на проверку.", "/projects/1/documents/2", false, LocalDateTime.of(2026, 5, 12, 8, 15)),
            new NotificationDto(3L, "Вам назначено замечание с высоким приоритетом.", "/remarks/1", false, LocalDateTime.of(2026, 5, 12, 8, 20)),
            new NotificationDto(4L, "Замечание по документу «Фасад главный» закрыто.", "/remarks/5", true, LocalDateTime.of(2026, 5, 11, 18, 0))
    );

    private static final List<AuditEntryDto> AUDIT_LOG = List.of(
            new AuditEntryDto(1L, "Иванов Иван Иванович", "Создан проект", "Многоэтажный жилой дом", "Руководитель проекта создал новый проект", LocalDateTime.of(2026, 5, 1, 9, 30)),
            new AuditEntryDto(2L, "Сидоров Сергей Сергеевич", "Загружен документ", "План 1 этажа", "Исполнитель загрузил исходную версию документа", LocalDateTime.of(2026, 5, 10, 11, 0)),
            new AuditEntryDto(3L, "Кузнецова Анна Андреевна", "Создано замечание", "План 1 этажа", "Проверяющий создал замечание по плану", LocalDateTime.of(2026, 5, 10, 12, 10)),
            new AuditEntryDto(4L, "Сидоров Сергей Сергеевич", "Загружена новая версия документа", "План 1 этажа", "Исполнитель устранил замечания и загрузил v2", LocalDateTime.of(2026, 5, 12, 15, 10))
    );

    @PostMapping("/auth/login")
    public LoginResponse login(@RequestBody LoginRequest request) {
        UserDto user = USERS.stream()
                .filter(candidate -> candidate.email().equalsIgnoreCase(request.email()) && Objects.equals("password", request.password()))
                .findFirst()
                .orElseThrow(() -> new ApiException("Неверный email или пароль"));

        return new LoginResponse(user.id(), user.fullName(), user.email(), user.role(), user.positionTitle(), "demo-token-" + user.id());
    }

    @GetMapping("/catalog")
    public CatalogDto catalog() {
        return new CatalogDto(
                List.of("ADMIN", "PROJECT_MANAGER", "EXECUTOR", "REVIEWER"),
                List.of("Создан", "В работе", "На проверке", "Есть замечания", "Просрочен", "Завершен", "Архивирован"),
                List.of("Не начат", "В работе", "На проверке", "Есть замечания", "Исправляется", "Принят", "Просрочен"),
                List.of("Черновик", "На проверке", "Есть замечания", "Исправляется", "Принят", "Отклонен"),
                List.of("Низкий", "Средний", "Высокий", "Критический"),
                List.of("Жилое здание", "Общественное здание", "Административное здание", "Промышленное здание", "Реконструкция", "Иное")
        );
    }

    @GetMapping("/dashboard")
    public DashboardDto dashboard() {
        return new DashboardDto(
                3,
                1,
                1,
                1,
                5,
                1,
                3,
                2,
                PROJECTS,
                DEADLINES,
                AUDIT_LOG,
                REVIEW_DOCS
        );
    }

    @GetMapping("/projects")
    public List<ProjectDto> projects() {
        return PROJECTS;
    }

    @GetMapping("/projects/{projectId}")
    public ProjectDetailDto project(@PathVariable Long projectId) {
        ProjectDto project = PROJECTS.stream()
                .filter(candidate -> candidate.id().equals(projectId))
                .findFirst()
                .orElseThrow(() -> new ApiException("Проект не найден"));

        List<ProjectMemberDto> members = List.of(
                new ProjectMemberDto(2L, "Петров Петр Петрович", "PROJECT_MANAGER", "Руководитель проекта", "manager@max-arh.local"),
                new ProjectMemberDto(3L, "Сидоров Сергей Сергеевич", "EXECUTOR", "Архитектор", "architect@max-arh.local"),
                new ProjectMemberDto(4L, "Кузнецова Анна Андреевна", "REVIEWER", "Проверяющий", "reviewer@max-arh.local")
        );

        List<StageDto> stages = List.of(
                new StageDto(1L, "Предпроектная подготовка", 1, "Сидоров Сергей Сергеевич", "Принят", LocalDate.of(2026, 5, 1), LocalDate.of(2026, 5, 10), LocalDate.of(2026, 5, 9), 100, 1, 0),
                new StageDto(2L, "Эскизный проект", 2, "Сидоров Сергей Сергеевич", "Принят", LocalDate.of(2026, 5, 10), LocalDate.of(2026, 5, 25), LocalDate.of(2026, 5, 24), 100, 1, 0),
                new StageDto(3L, "Проектная документация", 3, "Сидоров Сергей Сергеевич", "В работе", LocalDate.of(2026, 5, 25), LocalDate.of(2026, 6, 20), null, 60, 3, 1)
        );

        List<DocumentDto> documents = List.of(
                new DocumentDto(1L, "Пояснительная записка", "Проектная документация", "Пояснительная записка", 2, "Принят", "Сидоров Сергей Сергеевич", LocalDateTime.of(2026, 5, 12, 10, 0), "Уточнены исходные данные"),
                new DocumentDto(2L, "План 1 этажа", "Проектная документация", "План", 2, "Есть замечания", "Сидоров Сергей Сергеевич", LocalDateTime.of(2026, 5, 12, 15, 10), "Новая версия после замечаний"),
                new DocumentDto(3L, "Рабочие чертежи АР", "Проектная документация", "Рабочий чертеж", 1, "Черновик", "Сидоров Сергей Сергеевич", LocalDateTime.of(2026, 5, 11, 18, 0), "Первичная загрузка")
        );

        List<RemarkDto> remarks = List.of(
                new RemarkDto(1L, "Уточнить размеры эвакуационного выхода.", "План 1 этажа", "Проектная документация", "Кузнецова Анна Андреевна", "Сидоров Сергей Сергеевич", "Высокий", "В работе", LocalDate.of(2026, 5, 18)),
                new RemarkDto(2L, "Исправить обозначение помещения на плане 1 этажа.", "План 1 этажа", "Проектная документация", "Кузнецова Анна Андреевна", "Сидоров Сергей Сергеевич", "Средний", "Исправлено", LocalDate.of(2026, 5, 17))
        );

        return new ProjectDetailDto(project, members, stages, documents, remarks, AUDIT_LOG);
    }

    @GetMapping("/users")
    public List<UserDto> users() {
        return USERS;
    }

    @GetMapping("/documents/review")
    public List<DocumentReviewDto> documentsForReview() {
        return REVIEW_DOCS;
    }

    @GetMapping("/notifications")
    public List<NotificationDto> notifications() {
        return NOTIFICATIONS;
    }

    @GetMapping("/audit-log")
    public List<AuditEntryDto> auditLog() {
        return AUDIT_LOG;
    }

    @GetMapping("/remarks")
    public List<RemarkDto> remarks() {
        return List.of(
                new RemarkDto(1L, "Уточнить размеры эвакуационного выхода.", "План 1 этажа", "Проектная документация", "Кузнецова Анна Андреевна", "Сидоров Сергей Сергеевич", "Высокий", "В работе", LocalDate.of(2026, 5, 18)),
                new RemarkDto(2L, "Исправить обозначение помещения на плане 1 этажа.", "План 1 этажа", "Проектная документация", "Кузнецова Анна Андреевна", "Сидоров Сергей Сергеевич", "Средний", "Исправлено", LocalDate.of(2026, 5, 17)),
                new RemarkDto(3L, "Проверить соответствие фасада утвержденной концепции.", "Фасад главный", "Эскизный проект", "Кузнецова Анна Андреевна", "Сидоров Сергей Сергеевич", "Критический", "Открыто", LocalDate.of(2026, 5, 16))
        );
    }

    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    public static class ApiException extends RuntimeException {
        public ApiException(String message) {
            super(message);
        }
    }

    public record LoginRequest(String email, String password) {}

    public record LoginResponse(Long id, String fullName, String email, String role, String positionTitle, String token) {}

    public record CatalogDto(List<String> roles, List<String> projectStatuses, List<String> stageStatuses, List<String> documentStatuses, List<String> priorities, List<String> objectTypes) {}

    public record DashboardDto(
            int totalProjects,
            int projectsInProgress,
            int projectsOnReview,
            int overdueProjects,
            int openRemarks,
            int criticalRemarks,
            int docsForReview,
            int urgentStages,
            List<ProjectDto> projects,
            List<DashboardDeadlineDto> deadlines,
            List<AuditEntryDto> recentActions,
            List<DocumentReviewDto> reviewDocuments
    ) {}

    public record UserDto(Long id, String fullName, String email, String role, String positionTitle, boolean active, LocalDateTime createdAt) {}

    public record ProjectDto(
            Long id,
            String name,
            String description,
            String customer,
            String address,
            String objectType,
            Long managerId,
            String managerName,
            String currentStage,
            String status,
            int completionPercent,
            LocalDate startDate,
            LocalDate plannedFinishDate,
            LocalDate actualFinishDate,
            int openRemarksCount
    ) {}

    public record ProjectDetailDto(
            ProjectDto project,
            List<ProjectMemberDto> members,
            List<StageDto> stages,
            List<DocumentDto> documents,
            List<RemarkDto> remarks,
            List<AuditEntryDto> history
    ) {}

    public record ProjectMemberDto(Long id, String fullName, String role, String positionTitle, String email) {}

    public record StageDto(
            Long id,
            String name,
            int sortOrder,
            String responsible,
            String status,
            LocalDate startDate,
            LocalDate deadline,
            LocalDate finishDate,
            int completionPercent,
            int documentsCount,
            int openRemarksCount
    ) {}

    public record DocumentDto(
            Long id,
            String name,
            String stageName,
            String documentType,
            int currentVersion,
            String status,
            String uploadedBy,
            LocalDateTime uploadedAt,
            String comment
    ) {}

    public record DocumentReviewDto(
            Long id,
            String name,
            String projectName,
            String stageName,
            String documentType,
            int currentVersion,
            String uploadedBy,
            LocalDateTime sentAt,
            String status,
            int remarksCount
    ) {}

    public record RemarkDto(
            Long id,
            String text,
            String documentName,
            String stageName,
            String author,
            String responsible,
            String priority,
            String status,
            LocalDate fixDeadline
    ) {}

    public record NotificationDto(Long id, String message, String objectLink, boolean read, LocalDateTime createdAt) {}

    public record AuditEntryDto(Long id, String user, String action, String objectName, String description, LocalDateTime createdAt) {}

    public record DashboardDeadlineDto(Long id, String projectName, String stageName, String responsible, LocalDate deadline, int daysLeft) {}
}
