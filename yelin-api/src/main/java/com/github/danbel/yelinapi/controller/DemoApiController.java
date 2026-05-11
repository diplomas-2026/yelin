package com.github.danbel.yelinapi.controller;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Objects;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.atomic.AtomicLong;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping
public class DemoApiController {

    private static final List<UserDto> USERS = List.of(
            new UserDto(1L, "Иванов Иван Иванович", "admin@max-arh.local", "ADMIN", "Администратор", true, LocalDateTime.of(2026, 5, 1, 9, 0)),
            new UserDto(2L, "Петров Петр Петрович", "manager@max-arh.local", "PROJECT_MANAGER", "Руководитель проекта", true, LocalDateTime.of(2026, 5, 1, 9, 5)),
            new UserDto(3L, "Сидоров Сергей Сергеевич", "architect@max-arh.local", "EXECUTOR", "Архитектор", true, LocalDateTime.of(2026, 5, 1, 9, 10)),
            new UserDto(4L, "Кузнецова Анна Андреевна", "reviewer@max-arh.local", "REVIEWER", "Проверяющий", true, LocalDateTime.of(2026, 5, 1, 9, 15))
    );

    private static final List<ProjectDto> PROJECTS = List.of(
            new ProjectDto(1L, "Многоэтажный жилой дом", "Жилой комплекс с подземным паркингом", "ООО «ГрадСтрой»", "г. Самара, ул. Лесная, 12", "Жилое здание", 2L, "Петров Петр Петрович", "Проектная документация", "В работе", 50, LocalDate.of(2026, 5, 1), LocalDate.of(2026, 9, 15), null, 0),
            new ProjectDto(2L, "Административное здание", "Офисный комплекс для регионального офиса", "АО «РегионИнвест»", "г. Самара, ул. Набережная, 41", "Административное здание", 2L, "Петров Петр Петрович", "Эскизный проект", "На проверке", 33, LocalDate.of(2026, 4, 18), LocalDate.of(2026, 8, 30), null, 0),
            new ProjectDto(3L, "Реконструкция общественного здания", "Капитальная реконструкция объекта культуры", "МБУК «Центр культуры»", "г. Тольятти, проспект Победы, 8", "Реконструкция", 2L, "Петров Петр Петрович", "Рабочая документация", "Просрочен", 66, LocalDate.of(2026, 3, 10), LocalDate.of(2026, 5, 10), null, 0)
    );

    private static final List<ProjectMemberDto> PROJECT_MEMBERS = List.of(
            new ProjectMemberDto(2L, 1L, "Петров Петр Петрович", "PROJECT_MANAGER", "Руководитель проекта", "manager@max-arh.local"),
            new ProjectMemberDto(3L, 1L, "Сидоров Сергей Сергеевич", "EXECUTOR", "Архитектор", "architect@max-arh.local"),
            new ProjectMemberDto(4L, 1L, "Кузнецова Анна Андреевна", "REVIEWER", "Проверяющий", "reviewer@max-arh.local"),
            new ProjectMemberDto(2L, 2L, "Петров Петр Петрович", "PROJECT_MANAGER", "Руководитель проекта", "manager@max-arh.local"),
            new ProjectMemberDto(3L, 2L, "Сидоров Сергей Сергеевич", "EXECUTOR", "Архитектор", "architect@max-arh.local"),
            new ProjectMemberDto(4L, 2L, "Кузнецова Анна Андреевна", "REVIEWER", "Проверяющий", "reviewer@max-arh.local"),
            new ProjectMemberDto(2L, 3L, "Петров Петр Петрович", "PROJECT_MANAGER", "Руководитель проекта", "manager@max-arh.local"),
            new ProjectMemberDto(3L, 3L, "Сидоров Сергей Сергеевич", "EXECUTOR", "Архитектор", "architect@max-arh.local"),
            new ProjectMemberDto(4L, 3L, "Кузнецова Анна Андреевна", "REVIEWER", "Проверяющий", "reviewer@max-arh.local")
    );

    private static final List<StageDto> STAGES = new CopyOnWriteArrayList<>(List.of(
            new StageDto(1L, 1L, "Предпроектная подготовка", "Сбор исходных данных и обследование площадки", 1, "Сидоров Сергей Сергеевич", "Принят", LocalDate.of(2026, 5, 1), LocalDate.of(2026, 5, 10), LocalDate.of(2026, 5, 9), 100, 1, 0),
            new StageDto(2L, 1L, "Эскизный проект", "Формирование концепции и вариантов планировок", 2, "Сидоров Сергей Сергеевич", "Принят", LocalDate.of(2026, 5, 10), LocalDate.of(2026, 5, 25), LocalDate.of(2026, 5, 24), 100, 1, 0),
            new StageDto(3L, 1L, "Проектная документация", "Подготовка разделов ПД", 3, "Сидоров Сергей Сергеевич", "В работе", LocalDate.of(2026, 5, 25), LocalDate.of(2026, 6, 20), null, 60, 3, 1),
            new StageDto(4L, 1L, "Рабочая документация", "Выпуск рабочих чертежей", 4, "Сидоров Сергей Сергеевич", "Не начат", null, LocalDate.of(2026, 7, 15), null, 0, 0, 0),
            new StageDto(5L, 1L, "Проверка и согласование", "Передача на проверку", 5, "Кузнецова Анна Андреевна", "Не начат", null, LocalDate.of(2026, 8, 1), null, 0, 0, 0),
            new StageDto(6L, 1L, "Завершение проекта", "Финальная приемка", 6, "Петров Петр Петрович", "Не начат", null, LocalDate.of(2026, 9, 15), null, 0, 0, 0),
            new StageDto(7L, 2L, "Предпроектная подготовка", "Сбор исходных данных и ТУ", 1, "Сидоров Сергей Сергеевич", "Принят", LocalDate.of(2026, 4, 18), LocalDate.of(2026, 4, 30), LocalDate.of(2026, 4, 29), 100, 1, 0),
            new StageDto(8L, 2L, "Эскизный проект", "Схемы и основные планировочные решения", 2, "Сидоров Сергей Сергеевич", "На проверке", LocalDate.of(2026, 5, 1), LocalDate.of(2026, 5, 20), null, 70, 1, 0),
            new StageDto(9L, 2L, "Проектная документация", "Разработка альбома ПД", 3, "Сидоров Сергей Сергеевич", "Не начат", null, LocalDate.of(2026, 6, 15), null, 0, 0, 0),
            new StageDto(10L, 2L, "Рабочая документация", "Рабочие чертежи", 4, "Сидоров Сергей Сергеевич", "Не начат", null, LocalDate.of(2026, 7, 20), null, 0, 0, 0),
            new StageDto(11L, 2L, "Проверка и согласование", "Согласование со всеми участниками", 5, "Кузнецова Анна Андреевна", "Не начат", null, LocalDate.of(2026, 8, 20), null, 0, 0, 0),
            new StageDto(12L, 2L, "Завершение проекта", "Передача итогового комплекта", 6, "Петров Петр Петрович", "Не начат", null, LocalDate.of(2026, 8, 30), null, 0, 0, 0),
            new StageDto(13L, 3L, "Предпроектная подготовка", "Обследование и исходные данные", 1, "Сидоров Сергей Сергеевич", "Принят", LocalDate.of(2026, 3, 10), LocalDate.of(2026, 3, 28), LocalDate.of(2026, 3, 27), 100, 1, 0),
            new StageDto(14L, 3L, "Эскизный проект", "Концепция реконструкции", 2, "Сидоров Сергей Сергеевич", "Принят", LocalDate.of(2026, 3, 28), LocalDate.of(2026, 4, 18), LocalDate.of(2026, 4, 17), 100, 1, 0),
            new StageDto(15L, 3L, "Проектная документация", "Комплект ПД", 3, "Сидоров Сергей Сергеевич", "Есть замечания", LocalDate.of(2026, 4, 18), LocalDate.of(2026, 5, 10), null, 80, 2, 2),
            new StageDto(16L, 3L, "Рабочая документация", "Рабочие чертежи", 4, "Сидоров Сергей Сергеевич", "Исправляется", null, LocalDate.of(2026, 6, 10), null, 50, 1, 1),
            new StageDto(17L, 3L, "Проверка и согласование", "Проверка корректировок", 5, "Кузнецова Анна Андреевна", "Не начат", null, LocalDate.of(2026, 7, 1), null, 0, 0, 0),
            new StageDto(18L, 3L, "Завершение проекта", "Сдача объекта", 6, "Петров Петр Петрович", "Не начат", null, LocalDate.of(2026, 7, 20), null, 0, 0, 0)
    ));

    private static final List<DocumentDto> DOCUMENTS = new CopyOnWriteArrayList<>(List.of(
            new DocumentDto(1L, 1L, 1L, "Предпроектная подготовка", "Пояснительная записка", "Пояснительная записка", 2, "Принят", "Poyasnitelnaia_zapiska_v2.pdf", "PDF", 1245120, "Сидоров Сергей Сергеевич", LocalDateTime.of(2026, 5, 12, 10, 0), "Уточнены исходные данные"),
            new DocumentDto(2L, 1L, 3L, "Проектная документация", "План 1 этажа", "План", 2, "Есть замечания", "Plan_1_etazha_v2.pdf", "PDF", 2380120, "Сидоров Сергей Сергеевич", LocalDateTime.of(2026, 5, 12, 15, 10), "Новая версия после замечаний"),
            new DocumentDto(3L, 2L, 8L, "Эскизный проект", "Фасад главный", "Фасад", 1, "На проверке", "Fasad_glavnyi_v1.pdf", "PDF", 1830120, "Сидоров Сергей Сергеевич", LocalDateTime.of(2026, 5, 11, 14, 20), "Передан на согласование"),
            new DocumentDto(4L, 3L, 15L, "Проектная документация", "Архитектурные решения", "Архитектурные решения", 3, "Исправляется", "AR_v3.pdf", "PDF", 2940120, "Сидоров Сергей Сергеевич", LocalDateTime.of(2026, 5, 11, 9, 10), "Корректировки по замечаниям"),
            new DocumentDto(5L, 3L, 15L, "Проектная документация", "Схема генплана", "Схема генплана", 2, "На повторной проверке", "Genplan_v2.pdf", "PDF", 2094120, "Сидоров Сергей Сергеевич", LocalDateTime.of(2026, 5, 11, 10, 30), "Обновленная схема"),
            new DocumentDto(6L, 1L, 3L, "Проектная документация", "Рабочие чертежи АР", "Рабочий чертеж", 1, "Черновик", "RAB_AR_v1.pdf", "PDF", 3184120, "Сидоров Сергей Сергеевич", LocalDateTime.of(2026, 5, 11, 18, 0), "Первичная загрузка")
    ));

    private static final List<VersionDto> VERSIONS = new CopyOnWriteArrayList<>(List.of(
            new VersionDto(1L, 1L, 1, "Poyasnitelnaia_zapiska_v1.pdf", "Сидоров Сергей Сергеевич", LocalDateTime.of(2026, 5, 10, 10, 0), "Первичная загрузка"),
            new VersionDto(2L, 1L, 2, "Poyasnitelnaia_zapiska_v2.pdf", "Сидоров Сергей Сергеевич", LocalDateTime.of(2026, 5, 12, 9, 30), "После замечаний"),
            new VersionDto(3L, 2L, 1, "Plan_1_etazha_v1.pdf", "Сидоров Сергей Сергеевич", LocalDateTime.of(2026, 5, 10, 11, 0), "Первичная загрузка"),
            new VersionDto(4L, 2L, 2, "Plan_1_etazha_v2.pdf", "Сидоров Сергей Сергеевич", LocalDateTime.of(2026, 5, 12, 15, 10), "Исправление замечаний"),
            new VersionDto(5L, 3L, 1, "Fasad_glavnyi_v1.pdf", "Сидоров Сергей Сергеевич", LocalDateTime.of(2026, 5, 11, 14, 20), "Передача на проверку"),
            new VersionDto(6L, 4L, 1, "AR_v1.pdf", "Сидоров Сергей Сергеевич", LocalDateTime.of(2026, 5, 9, 12, 0), "Первичная загрузка"),
            new VersionDto(7L, 4L, 2, "AR_v2.pdf", "Сидоров Сергей Сергеевич", LocalDateTime.of(2026, 5, 10, 16, 40), "Доработка по замечаниям"),
            new VersionDto(8L, 4L, 3, "AR_v3.pdf", "Сидоров Сергей Сергеевич", LocalDateTime.of(2026, 5, 11, 9, 10), "Повторная проверка")
    ));

    private static final List<RemarkDto> REMARKS = new CopyOnWriteArrayList<>(List.of(
            new RemarkDto(1L, 1L, 3L, 2L, "Уточнить размеры эвакуационного выхода.", "План 1 этажа", "Проектная документация", "Кузнецова Анна Андреевна", "Сидоров Сергей Сергеевич", "Высокий", "В работе", LocalDate.of(2026, 5, 18), "Готовлю корректировку"),
            new RemarkDto(2L, 1L, 3L, 2L, "Исправить обозначение помещения на плане 1 этажа.", "План 1 этажа", "Проектная документация", "Кузнецова Анна Андреевна", "Сидоров Сергей Сергеевич", "Средний", "Исправлено", LocalDate.of(2026, 5, 17), "Обозначение исправлено"),
            new RemarkDto(3L, 2L, 8L, 3L, "Проверить соответствие фасада утвержденной концепции.", "Фасад главный", "Эскизный проект", "Кузнецова Анна Андреевна", "Сидоров Сергей Сергеевич", "Критический", "Открыто", LocalDate.of(2026, 5, 16), null),
            new RemarkDto(4L, 3L, 15L, 4L, "Добавить ссылку на ведомость отделки.", "Архитектурные решения", "Проектная документация", "Кузнецова Анна Андреевна", "Сидоров Сергей Сергеевич", "Низкий", "На повторной проверке", LocalDate.of(2026, 5, 20), "Ссылка добавлена"),
            new RemarkDto(5L, 3L, 15L, 4L, "Загрузить актуальную версию пояснительной записки.", "Архитектурные решения", "Проектная документация", "Кузнецова Анна Андреевна", "Сидоров Сергей Сергеевич", "Высокий", "Закрыто", LocalDate.of(2026, 5, 14), "Последняя версия загружена")
    ));

    private static final List<NotificationDto> NOTIFICATIONS = new CopyOnWriteArrayList<>(List.of(
            new NotificationDto(1L, "architect@max-arh.local", "Вам назначен этап «Проектная документация».", "/projects/1/stages/3", false, LocalDateTime.of(2026, 5, 12, 8, 0)),
            new NotificationDto(2L, "reviewer@max-arh.local", "Документ «План 1 этажа» отправлен на проверку.", "/projects/1/documents/2", false, LocalDateTime.of(2026, 5, 12, 8, 15)),
            new NotificationDto(3L, "architect@max-arh.local", "Вам назначено замечание с высоким приоритетом.", "/remarks/1", false, LocalDateTime.of(2026, 5, 12, 8, 20)),
            new NotificationDto(4L, "architect@max-arh.local", "Замечание по документу «Фасад главный» закрыто.", "/remarks/5", true, LocalDateTime.of(2026, 5, 11, 18, 0)),
            new NotificationDto(5L, "manager@max-arh.local", "Этап «Рабочая документация» просрочен.", "/projects/3/stages/4", false, LocalDateTime.of(2026, 5, 12, 8, 35))
    ));

    private static final List<AuditEntryDto> AUDIT_LOG = new CopyOnWriteArrayList<>(List.of(
            new AuditEntryDto(1L, "Петров Петр Петрович", "Создан проект", "Многоэтажный жилой дом", "Руководитель проекта создал новый проект", LocalDateTime.of(2026, 5, 1, 9, 30)),
            new AuditEntryDto(2L, "Сидоров Сергей Сергеевич", "Загружен документ", "План 1 этажа", "Исполнитель загрузил исходную версию документа", LocalDateTime.of(2026, 5, 10, 11, 0)),
            new AuditEntryDto(3L, "Кузнецова Анна Андреевна", "Создано замечание", "План 1 этажа", "Проверяющий создал замечание по плану", LocalDateTime.of(2026, 5, 10, 12, 10)),
            new AuditEntryDto(4L, "Сидоров Сергей Сергеевич", "Загружена новая версия документа", "План 1 этажа", "Исполнитель устранил замечания и загрузил v2", LocalDateTime.of(2026, 5, 12, 15, 10)),
            new AuditEntryDto(5L, "Кузнецова Анна Андреевна", "Замечание закрыто", "План 1 этажа", "Проверяющий закрыл замечание после исправления", LocalDateTime.of(2026, 5, 12, 18, 5))
    ));

    private static final AtomicLong NEXT_REMARK_ID = new AtomicLong(6L);
    private static final AtomicLong NEXT_VERSION_ID = new AtomicLong(9L);
    private static final AtomicLong NEXT_NOTIFICATION_ID = new AtomicLong(6L);
    private static final AtomicLong NEXT_AUDIT_ID = new AtomicLong(6L);

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
        List<ProjectDto> projectViews = projectViews();
        List<DashboardDeadlineDto> deadlines = projectViews.stream()
                .flatMap(project -> stagesForProject(project.id()).stream())
                .filter(stage -> stage.deadline() != null)
                .filter(stage -> daysLeft(stage.deadline()) <= 40)
                .sorted(Comparator.comparing(StageDto::deadline))
                .map(stage -> new DashboardDeadlineDto(
                        stage.id(),
                        projectName(stage.projectId()),
                        stage.name(),
                        stage.responsible(),
                        stage.deadline(),
                        daysLeft(stage.deadline())
                ))
                .limit(4)
                .toList();

        List<AuditEntryDto> recentActions = new ArrayList<>(AUDIT_LOG);
        recentActions.sort(Comparator.comparing(AuditEntryDto::createdAt).reversed());

        return new DashboardDto(
                projectViews.size(),
                (int) projectViews.stream().filter(project -> "В работе".equals(project.status())).count(),
                (int) projectViews.stream().filter(project -> "На проверке".equals(project.status())).count(),
                (int) projectViews.stream().filter(project -> "Просрочен".equals(project.status())).count(),
                openRemarksCount(),
                criticalRemarksCount(),
                reviewQueue().size(),
                (int) STAGES.stream().filter(stage -> stage.deadline() != null && daysLeft(stage.deadline()) <= 7 && daysLeft(stage.deadline()) >= 0).count(),
                projectViews,
                deadlines,
                recentActions.stream().limit(4).toList(),
                reviewQueue()
        );
    }

    @GetMapping("/projects")
    public List<ProjectDto> projects() {
        return projectViews();
    }

    @GetMapping("/projects/{projectId}")
    public ProjectDetailDto project(@PathVariable Long projectId) {
        ProjectDto project = projectView(projectId);
        return new ProjectDetailDto(
                project,
                membersForProject(projectId),
                stagesForProject(projectId),
                documentsForProject(projectId),
                remarksForProject(projectId),
                historyForProject(projectId)
        );
    }

    @GetMapping("/users")
    public List<UserDto> users() {
        return USERS;
    }

    @GetMapping("/documents/review")
    public List<DocumentReviewDto> documentsForReview() {
        return reviewQueue();
    }

    @GetMapping("/versions")
    public List<VersionDto> versions() {
        return sortedVersions();
    }

    @GetMapping("/notifications")
    public List<NotificationDto> notifications() {
        return List.copyOf(NOTIFICATIONS);
    }

    @GetMapping("/audit-log")
    public List<AuditEntryDto> auditLog() {
        return List.copyOf(AUDIT_LOG);
    }

    @GetMapping("/remarks")
    public List<RemarkDto> remarks() {
        return remarksSnapshot();
    }

    @PostMapping("/documents/{documentId}/approve")
    public ActionResponse approveDocument(@PathVariable Long documentId, @RequestBody(required = false) ActionRequest request) {
        DocumentDto updated = updateDocument(documentId, document -> {
            if (openRemarksForDocument(document.id()) > 0) {
                throw new ApiException("Сначала закройте все замечания");
            }
            return document.withStatus("Принят").withComment(nonEmpty(request != null ? request.comment() : null, document.comment()));
        });

        addAudit(actorName(request), "Документ принят", updated.name(), "Документ принят пользователем " + actorName(request));
        notifyUploader(updated, "Документ «" + updated.name() + "» принят.", "/projects/" + updated.projectId() + "/documents/" + updated.id());
        return new ActionResponse("Документ принят.");
    }

    @PostMapping("/documents/{documentId}/return")
    public ActionResponse returnDocument(@PathVariable Long documentId, @RequestBody(required = false) ActionRequest request) {
        DocumentDto updated = updateDocument(documentId, document -> document.withStatus("Есть замечания"));
        addAudit(actorName(request), "Документ возвращен на доработку", updated.name(), "Документ возвращен на доработку");
        notifyUploader(updated, "Документ «" + updated.name() + "» возвращен на доработку.", "/projects/" + updated.projectId() + "/documents/" + updated.id());
        return new ActionResponse("Документ возвращен на доработку.");
    }

    @PostMapping("/documents/{documentId}/remarks")
    public ActionResponse createRemark(@PathVariable Long documentId, @RequestBody RemarkCreateRequest request) {
        DocumentDto document = findDocument(documentId);
        String responsible = document.uploadedBy();
        Long responsibleProjectId = document.projectId();
        Long responsibleStageId = document.stageId();
        LocalDate deadline = LocalDate.now().plusDays(7);

        RemarkDto remark = new RemarkDto(
                NEXT_REMARK_ID.getAndIncrement(),
                responsibleProjectId,
                responsibleStageId,
                document.id(),
                request.text(),
                document.name(),
                document.stageName(),
                actorName(request),
                responsible,
                nonEmpty(request.priority(), "Средний"),
                "Открыто",
                deadline,
                null
        );

        REMARKS.add(remark);
        updateDocument(documentId, current -> current.withStatus("Есть замечания"));
        addAudit(actorName(request), "Создано замечание", document.name(), request.text());
        notifyByRole("EXECUTOR", "Вам назначено новое замечание по документу «" + document.name() + "».", "/remarks/" + remark.id());
        notifyByEmail(emailByFullName(responsible), "Вам назначено замечание по документу «" + document.name() + "».", "/remarks/" + remark.id());
        return new ActionResponse("Замечание создано.");
    }

    @PostMapping("/remarks/{remarkId}/close")
    public ActionResponse closeRemark(@PathVariable Long remarkId, @RequestBody(required = false) ActionRequest request) {
        RemarkDto updatedRemark = updateRemark(remarkId, remark -> remark.withStatus("Закрыто").withExecutorComment(nonEmpty(request != null ? request.comment() : null, remark.executorComment())));
        DocumentDto updatedDocument = updateDocument(updatedRemark.documentId(), document -> {
            if (openRemarksForDocument(document.id()) == 0) {
                return document.withStatus("На проверке");
            }
            return document;
        });

        addAudit(actorName(request), "Замечание закрыто", updatedRemark.documentName(), "Замечание #" + updatedRemark.id() + " закрыто");
        notifyByEmail(emailByFullName(updatedRemark.responsible()), "Замечание по документу «" + updatedRemark.documentName() + "» закрыто.", "/remarks/" + updatedRemark.id());
        notifyByRole("EXECUTOR", "Замечание по документу «" + updatedRemark.documentName() + "» закрыто.", "/remarks/" + updatedRemark.id());
        return new ActionResponse(updatedDocument.status().equals("На проверке")
                ? "Замечание закрыто. Документ готов к повторной проверке."
                : "Замечание закрыто.");
    }

    @PostMapping("/documents/{documentId}/versions")
    public ActionResponse uploadVersion(@PathVariable Long documentId, @RequestBody ActionRequest request) {
        DocumentDto updated = updateDocument(documentId, document -> {
            int nextVersion = document.currentVersion() + 1;
            String fileName = versionFileName(document.fileName(), document.name(), nextVersion);
            VersionDto version = new VersionDto(
                    NEXT_VERSION_ID.getAndIncrement(),
                    document.id(),
                    nextVersion,
                    fileName,
                    actorName(request),
                    LocalDateTime.now(),
                    nonEmpty(request.comment(), "Новая версия загружена")
            );
            VERSIONS.add(version);
            return document
                    .withCurrentVersion(nextVersion)
                    .withStatus("Исправляется")
                    .withFileName(fileName)
                    .withUploadedBy(actorName(request))
                    .withUploadedAt(LocalDateTime.now())
                    .withComment(nonEmpty(request.comment(), document.comment()));
        });

        addAudit(actorName(request), "Загружена новая версия документа", updated.name(), "Загружена версия v" + updated.currentVersion());
        notifyByRole("REVIEWER", "Новая версия документа «" + updated.name() + "» загружена.", "/projects/" + updated.projectId() + "/documents/" + updated.id());
        return new ActionResponse("Новая версия загружена.");
    }

    @PostMapping("/documents/{documentId}/submit")
    public ActionResponse sendToReview(@PathVariable Long documentId, @RequestBody ActionRequest request) {
        DocumentDto updated = updateDocument(documentId, document -> document.withStatus(hasOpenRemarks(document) ? "На повторной проверке" : "На проверке"));
        addAudit(actorName(request), "Документ отправлен на проверку", updated.name(), "Документ отправлен на проверку");
        notifyByRole("REVIEWER", "Документ «" + updated.name() + "» отправлен на проверку.", "/projects/" + updated.projectId() + "/documents/" + updated.id());
        return new ActionResponse("Документ отправлен на проверку.");
    }

    @PatchMapping("/notifications/{notificationId}")
    public ActionResponse updateNotification(@PathVariable Long notificationId, @RequestBody NotificationReadRequest request) {
        NotificationDto updated = replaceNotification(notificationId, notification -> notification.withRead(request.read()));
        return new ActionResponse(updated.read() ? "Уведомление отмечено как прочитанное." : "Уведомление отмечено как непрочитанное.");
    }

    @PostMapping("/notifications/read-all")
    public ActionResponse readAllNotifications(@RequestBody NotificationBulkReadRequest request) {
        for (int index = 0; index < NOTIFICATIONS.size(); index++) {
            NotificationDto notification = NOTIFICATIONS.get(index);
            if (notification.userEmail().equalsIgnoreCase(request.userEmail())) {
                NOTIFICATIONS.set(index, notification.withRead(true));
            }
        }
        return new ActionResponse("Все уведомления отмечены как прочитанные.");
    }

    private static List<ProjectDto> projectViews() {
        return PROJECTS.stream().map(project -> projectView(project.id())).toList();
    }

    private static ProjectDto projectView(Long projectId) {
        ProjectDto project = PROJECTS.stream()
                .filter(candidate -> candidate.id().equals(projectId))
                .findFirst()
                .orElseThrow(() -> new ApiException("Проект не найден"));
        return project.withOpenRemarksCount(openRemarksForProject(projectId));
    }

    private static List<ProjectMemberDto> membersForProject(Long projectId) {
        return PROJECT_MEMBERS.stream().filter(member -> member.projectId().equals(projectId)).toList();
    }

    private static List<StageDto> stagesForProject(Long projectId) {
        return STAGES.stream()
                .filter(stage -> stage.projectId().equals(projectId))
                .map(stage -> stage.withDocumentsCount((int) DOCUMENTS.stream().filter(document -> document.stageId().equals(stage.id())).count())
                        .withOpenRemarksCount((int) REMARKS.stream().filter(remark -> remark.stageId().equals(stage.id()) && isOpenRemark(remark.status())).count()))
                .sorted(Comparator.comparing(StageDto::sortOrder))
                .toList();
    }

    private static List<DocumentDto> documentsForProject(Long projectId) {
        return DOCUMENTS.stream()
                .filter(document -> document.projectId().equals(projectId))
                .sorted(Comparator.comparing(DocumentDto::id))
                .toList();
    }

    private static List<RemarkDto> remarksForProject(Long projectId) {
        return remarksSnapshot().stream().filter(remark -> remark.projectId().equals(projectId)).toList();
    }

    private static List<AuditEntryDto> historyForProject(Long projectId) {
        String projectName = projectName(projectId);
        return AUDIT_LOG.stream().filter(entry -> entry.objectName().equals(projectName) || entry.description().contains(projectName)).toList();
    }

    private static List<RemarkDto> remarksSnapshot() {
        return REMARKS.stream()
                .map(remark -> remark.withDocumentName(documentName(remark.documentId())).withStageName(stageName(remark.stageId())))
                .sorted(Comparator.comparing(RemarkDto::id))
                .toList();
    }

    private static List<VersionDto> sortedVersions() {
        return VERSIONS.stream()
                .sorted(Comparator.comparing(VersionDto::documentId).thenComparing(VersionDto::version))
                .toList();
    }

    private static List<DocumentReviewDto> reviewQueue() {
        return DOCUMENTS.stream()
                .filter(document -> "На проверке".equals(document.status()) || "На повторной проверке".equals(document.status()))
                .map(document -> new DocumentReviewDto(
                        document.id(),
                        document.projectId(),
                        document.stageId(),
                        document.id(),
                        document.name(),
                        projectName(document.projectId()),
                        stageName(document.stageId()),
                        document.type(),
                        document.currentVersion(),
                        document.uploadedBy(),
                        document.uploadedAt(),
                        document.status(),
                        (int) REMARKS.stream().filter(remark -> remark.documentId().equals(document.id())).count()
                ))
                .sorted(Comparator.comparing(DocumentReviewDto::sentAt).reversed())
                .toList();
    }

    private static int openRemarksCount() {
        return (int) REMARKS.stream().filter(remark -> isOpenRemark(remark.status())).count();
    }

    private static int criticalRemarksCount() {
        return (int) REMARKS.stream().filter(remark -> "Критический".equals(remark.priority()) && isOpenRemark(remark.status())).count();
    }

    private static int openRemarksForProject(Long projectId) {
        return (int) REMARKS.stream().filter(remark -> remark.projectId().equals(projectId) && isOpenRemark(remark.status())).count();
    }

    private static int openRemarksForDocument(Long documentId) {
        return (int) REMARKS.stream().filter(remark -> remark.documentId().equals(documentId) && isOpenRemark(remark.status())).count();
    }

    private static boolean hasOpenRemarks(DocumentDto document) {
        return openRemarksForDocument(document.id()) > 0;
    }

    private static boolean isOpenRemark(String status) {
        return List.of("Открыто", "В работе", "На повторной проверке").contains(status);
    }

    private static DocumentDto updateDocument(Long documentId, java.util.function.Function<DocumentDto, DocumentDto> updater) {
        for (int index = 0; index < DOCUMENTS.size(); index++) {
            DocumentDto document = DOCUMENTS.get(index);
            if (document.id().equals(documentId)) {
                DocumentDto updated = updater.apply(document);
                DOCUMENTS.set(index, updated);
                return updated;
            }
        }
        throw new ApiException("Документ не найден");
    }

    private static RemarkDto updateRemark(Long remarkId, java.util.function.Function<RemarkDto, RemarkDto> updater) {
        for (int index = 0; index < REMARKS.size(); index++) {
            RemarkDto remark = REMARKS.get(index);
            if (remark.id().equals(remarkId)) {
                RemarkDto updated = updater.apply(remark);
                REMARKS.set(index, updated);
                return updated;
            }
        }
        throw new ApiException("Замечание не найдено");
    }

    private static DocumentDto findDocument(Long documentId) {
        return DOCUMENTS.stream()
                .filter(document -> document.id().equals(documentId))
                .findFirst()
                .orElseThrow(() -> new ApiException("Документ не найден"));
    }

    private static NotificationDto replaceNotification(Long notificationId, java.util.function.Function<NotificationDto, NotificationDto> updater) {
        for (int index = 0; index < NOTIFICATIONS.size(); index++) {
            NotificationDto notification = NOTIFICATIONS.get(index);
            if (notification.id().equals(notificationId)) {
                NotificationDto updated = updater.apply(notification);
                NOTIFICATIONS.set(index, updated);
                return updated;
            }
        }
        throw new ApiException("Уведомление не найдено");
    }

    private static void addAudit(String user, String action, String objectName, String description) {
        AUDIT_LOG.add(new AuditEntryDto(NEXT_AUDIT_ID.getAndIncrement(), user, action, objectName, description, LocalDateTime.now()));
    }

    private static void notifyUploader(DocumentDto document, String message, String objectLink) {
        notifyByEmail(emailByFullName(document.uploadedBy()), message, objectLink);
    }

    private static void notifyByRole(String role, String message, String objectLink) {
        USERS.stream()
                .filter(user -> role.equals(user.role()))
                .forEach(user -> NOTIFICATIONS.add(new NotificationDto(NEXT_NOTIFICATION_ID.getAndIncrement(), user.email(), message, objectLink, false, LocalDateTime.now())));
    }

    private static void notifyByEmail(String email, String message, String objectLink) {
        if (email == null) {
            return;
        }
        NOTIFICATIONS.add(new NotificationDto(NEXT_NOTIFICATION_ID.getAndIncrement(), email, message, objectLink, false, LocalDateTime.now()));
    }

    private static String emailByFullName(String fullName) {
        return USERS.stream().filter(user -> user.fullName().equals(fullName)).map(UserDto::email).findFirst().orElse(null);
    }

    private static String actorName(ActionRequest request) {
        return request != null && request.actorName() != null && !request.actorName().isBlank() ? request.actorName() : "Система";
    }

    private static String actorName(RemarkCreateRequest request) {
        return request != null && request.actorName() != null && !request.actorName().isBlank() ? request.actorName() : "Система";
    }

    private static String projectName(Long projectId) {
        return PROJECTS.stream().filter(project -> project.id().equals(projectId)).map(ProjectDto::name).findFirst().orElse("Проект");
    }

    private static String stageName(Long stageId) {
        return STAGES.stream().filter(stage -> stage.id().equals(stageId)).map(StageDto::name).findFirst().orElse("Этап");
    }

    private static String documentName(Long documentId) {
        return DOCUMENTS.stream().filter(document -> document.id().equals(documentId)).map(DocumentDto::name).findFirst().orElse("Документ");
    }

    private static String nonEmpty(String value, String fallback) {
        return value != null && !value.isBlank() ? value : fallback;
    }

    private static String versionFileName(String currentFileName, String documentName, int version) {
        String suffix = currentFileName != null && currentFileName.contains(".")
                ? currentFileName.substring(currentFileName.lastIndexOf('.'))
                : ".pdf";
        String normalized = documentName.replace(' ', '_');
        return normalized + "_v" + version + suffix;
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
    ) {
        public ProjectDto withOpenRemarksCount(int openRemarksCount) {
            return new ProjectDto(id, name, description, customer, address, objectType, managerId, managerName, currentStage, status, completionPercent, startDate, plannedFinishDate, actualFinishDate, openRemarksCount);
        }
    }

    public record ProjectDetailDto(ProjectDto project, List<ProjectMemberDto> members, List<StageDto> stages, List<DocumentDto> documents, List<RemarkDto> remarks, List<AuditEntryDto> history) {}

    public record ProjectMemberDto(Long id, Long projectId, String fullName, String role, String positionTitle, String email) {}

    public record StageDto(
            Long id,
            Long projectId,
            String name,
            String description,
            int sortOrder,
            String responsible,
            String status,
            LocalDate startDate,
            LocalDate deadline,
            LocalDate finishDate,
            int completionPercent,
            int documentsCount,
            int openRemarksCount
    ) {
        public StageDto withDocumentsCount(int documentsCount) {
            return new StageDto(id, projectId, name, description, sortOrder, responsible, status, startDate, deadline, finishDate, completionPercent, documentsCount, openRemarksCount);
        }

        public StageDto withOpenRemarksCount(int openRemarksCount) {
            return new StageDto(id, projectId, name, description, sortOrder, responsible, status, startDate, deadline, finishDate, completionPercent, documentsCount, openRemarksCount);
        }
    }

    public record DocumentDto(
            Long id,
            Long projectId,
            Long stageId,
            String stageName,
            String name,
            String type,
            int currentVersion,
            String status,
            String fileName,
            String extension,
            long size,
            String uploadedBy,
            LocalDateTime uploadedAt,
            String comment
    ) {
        public DocumentDto withStatus(String status) {
            return new DocumentDto(id, projectId, stageId, stageName, name, type, currentVersion, status, fileName, extension, size, uploadedBy, uploadedAt, comment);
        }

        public DocumentDto withCurrentVersion(int currentVersion) {
            return new DocumentDto(id, projectId, stageId, stageName, name, type, currentVersion, status, fileName, extension, size, uploadedBy, uploadedAt, comment);
        }

        public DocumentDto withFileName(String fileName) {
            return new DocumentDto(id, projectId, stageId, stageName, name, type, currentVersion, status, fileName, extension, size, uploadedBy, uploadedAt, comment);
        }

        public DocumentDto withUploadedBy(String uploadedBy) {
            return new DocumentDto(id, projectId, stageId, stageName, name, type, currentVersion, status, fileName, extension, size, uploadedBy, uploadedAt, comment);
        }

        public DocumentDto withUploadedAt(LocalDateTime uploadedAt) {
            return new DocumentDto(id, projectId, stageId, stageName, name, type, currentVersion, status, fileName, extension, size, uploadedBy, uploadedAt, comment);
        }

        public DocumentDto withComment(String comment) {
            return new DocumentDto(id, projectId, stageId, stageName, name, type, currentVersion, status, fileName, extension, size, uploadedBy, uploadedAt, comment);
        }
    }

    public record VersionDto(Long id, Long documentId, int version, String fileName, String uploadedBy, LocalDateTime uploadedAt, String comment) {}

    public record RemarkDto(
            Long id,
            Long projectId,
            Long stageId,
            Long documentId,
            String text,
            String documentName,
            String stageName,
            String author,
            String responsible,
            String priority,
            String status,
            LocalDate fixDeadline,
            String executorComment
    ) {
        public RemarkDto withDocumentName(String documentName) {
            return new RemarkDto(id, projectId, stageId, documentId, text, documentName, stageName, author, responsible, priority, status, fixDeadline, executorComment);
        }

        public RemarkDto withStageName(String stageName) {
            return new RemarkDto(id, projectId, stageId, documentId, text, documentName, stageName, author, responsible, priority, status, fixDeadline, executorComment);
        }

        public RemarkDto withStatus(String status) {
            return new RemarkDto(id, projectId, stageId, documentId, text, documentName, stageName, author, responsible, priority, status, fixDeadline, executorComment);
        }

        public RemarkDto withExecutorComment(String executorComment) {
            return new RemarkDto(id, projectId, stageId, documentId, text, documentName, stageName, author, responsible, priority, status, fixDeadline, executorComment);
        }
    }

    public record NotificationDto(Long id, String userEmail, String message, String objectLink, boolean read, LocalDateTime createdAt) {
        public NotificationDto withRead(boolean read) {
            return new NotificationDto(id, userEmail, message, objectLink, read, createdAt);
        }
    }

    public record AuditEntryDto(Long id, String user, String action, String objectName, String description, LocalDateTime createdAt) {}

    public record DashboardDeadlineDto(Long id, String projectName, String stageName, String responsible, LocalDate deadline, int daysLeft) {}

    public record DocumentReviewDto(Long id, Long projectId, Long stageId, Long documentId, String name, String projectName, String stageName, String documentType, int version, String uploadedBy, LocalDateTime sentAt, String status, int remarksCount) {}

    public record ActionResponse(String message) {}

    public record ActionRequest(String actorName, String actorEmail, String comment, String text, String priority) {}

    public record RemarkCreateRequest(String actorName, String actorEmail, String text, String priority) {}

    public record NotificationReadRequest(boolean read) {}

    public record NotificationBulkReadRequest(String userEmail) {}

    private static int daysLeft(LocalDate deadline) {
        if (deadline == null) {
            return 0;
        }
        LocalDate today = LocalDate.now();
        return (int) (deadline.toEpochDay() - today.toEpochDay());
    }
}
