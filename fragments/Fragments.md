### Рисунок 2.13 — Основной класс запуска серверного приложения

### [Скрин кода](./img_1.png)

```java
public static void main(String[] args) {
    SpringApplication.run(YelinApiApplication.class, args);
}
```

### Рисунок 2.14 — Реализация сущности проекта

### [Скрин кода](./img_2.png)

```java
public record Project(
        Long id,
        String name,
        String description,
        String customer,
        String address,
        String objectType,
        String status,
        Long managerId,
        LocalDate startDate,
        LocalDate plannedFinishDate,
        LocalDate actualFinishDate,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}
```

### Рисунок 2.15 — Реализация сущности пользователя

### [Скрин кода](./img_3.png)

```java
public record User(
        Long id,
        String fullName,
        String email,
        String passwordHash,
        String role,
        String positionTitle,
        String phone,
        String department,
        Boolean active,
        LocalDateTime createdAt
) {
}
```

### Рисунок 2.16 — Настройка безопасности и ролевого доступа

### [Скрин кода](./img_4.png)

```java
public SecurityFilterChain securityFilterChain(HttpSecurity http, JwtAuthenticationFilter jwtAuthenticationFilter) throws Exception {
    return http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                    .requestMatchers("/auth/login").permitAll()
                    .requestMatchers("/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html").permitAll()
                    .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
            .build();
}
```

### Рисунок 2.17 — Реализация контроллера пользователей

### [Скрин кода](./img_5.png)

```java
@GetMapping
public List<UserResponse> findAll() {
    return userService.findAll();
}

@PostMapping
public UserResponse create(@RequestBody UserRequest request) {
    return userService.create(request);
}

@PutMapping("/{id}")
public UserResponse update(@PathVariable Long id, @RequestBody UserRequest request) {
    return userService.update(id, request);
}
```

### Рисунок 2.18 — Реализация репозитория пользователей

### [Скрин кода](./img_6.png)

```java
public Long create(UserRequest request) {
    return jdbc.sql("""
                    INSERT INTO app_users (full_name, email, password_hash, role, position_title, phone, department, active)
                    VALUES (:fullName, :email, :passwordHash, :role, :positionTitle, :phone, :department, :active)
                    RETURNING id
                    """)
            .param("fullName", request.fullName())
            .param("email", request.email())
            .param("passwordHash", request.password() == null || request.password().isBlank() ? "password" : request.password())
            .param("role", request.role())
            .param("positionTitle", request.positionTitle())
            .param("phone", request.phone())
            .param("department", request.department())
            .param("active", request.active() == null || request.active())
            .query(Long.class)
            .single();
}
```

### Рисунок 2.19 — Реализация контроллера проектов

### [Скрин кода](./img_7.png)

```java
@GetMapping
public List<ProjectResponse> findAll(Authentication authentication) {
    return projectService.findAllFor(currentUser(authentication));
}

@PostMapping
public ProjectResponse create(@RequestBody ProjectRequest request) {
    return projectService.create(request);
}

@PatchMapping("/{id}/status")
public ProjectResponse updateStatus(@PathVariable Long id, @RequestBody ProjectStatusRequest request, Authentication authentication) {
    return projectService.updateStatus(id, request.status(), currentUser(authentication));
}
```

### Рисунок 2.20 — Реализация сервиса проектов

### [Скрин кода](./img_8.png)

```java
public ProjectResponse create(ProjectRequest request) {
    Long id = projectRepository.create(normalize(request));
    return findById(id);
}

public ProjectResponse update(Long id, ProjectRequest request) {
    projectRepository.update(id, normalize(request));
    return findById(id);
}
```

### Рисунок 2.21 — Реализация назначения инженеров на проект

### [Скрин кода](./img_9.png)

```java
private void replaceEngineers(Long projectId, List<Long> engineerIds) {
    jdbc.sql("DELETE FROM project_engineers WHERE project_id = :projectId").param("projectId", projectId).update();
    if (engineerIds == null) {
        return;
    }
    engineerIds.forEach(userId -> jdbc.sql("INSERT INTO project_engineers (project_id, user_id) VALUES (:projectId, :userId)")
            .param("projectId", projectId)
            .param("userId", userId)
            .update());
}
```

### Рисунок 2.22 — Реализация метода смены статуса проекта

### [Скрин кода](./img_10.png)

```java
public ProjectResponse updateStatus(Long id, String status, User user) {
    Project project = getProject(id);
    if ("ENGINEER".equals(user.role()) && (!ENGINEER_EDIT_STATUSES.contains(project.status()) || !"На проверке".equals(status))) {
        throw new IllegalArgumentException("Инженер может отправлять на проверку только проекты в работе или на доработке");
    }
    projectRepository.updateStatus(id, status);
    return findById(id);
}
```

### Рисунок 2.23 — Реализация контроллера документов

### [Скрин кода](./img_11.png)

```java
@PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
public DocumentResponse create(
        @RequestParam Long projectId,
        @RequestParam("file") MultipartFile file,
        @RequestParam(value = "comment", required = false) String comment,
        Authentication authentication
) {
    return documentService.create(projectId, file, comment, currentUser(authentication));
}
```

### Рисунок 2.24 — Реализация метода скачивания документа

### [Скрин кода](./img_12.png)

```java
@GetMapping("/{id}/download")
public ResponseEntity<byte[]> download(@PathVariable Long id) {
    var document = documentService.download(id);
    return ResponseEntity.ok()
            .contentType(MediaType.parseMediaType(document.mimeType()))
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename='" + document.fileName() + "'")
            .body(document.content());
}
```

### Рисунок 2.25 — Реализация контроллера сообщений проектного чата

### [Скрин кода](./img_13.png)

```java
@PostMapping
public ChatMessageResponse create(@PathVariable Long projectId, @RequestBody ChatMessageRequest request, Authentication authentication) {
    return chatService.create(projectId, currentUser(authentication), request.message());
}
```

### Рисунок 2.26 — Реализация получения сообщений проекта

### [Скрин кода](./img_14.png)

```java
@GetMapping
public List<ChatMessageResponse> findMessages(@PathVariable Long projectId, Authentication authentication) {
    return chatService.findMessages(projectId, currentUser(authentication));
}
```

### Рисунок 2.27 — Реализация сервиса сводной панели

### [Скрин кода](./img_15.png)

```java
public DashboardResponse getDashboard() {
    return new DashboardResponse(
            projectRepository.count(),
            projectRepository.countByStatus("В работе"),
            projectRepository.countByStatus("На проверке"),
            projectRepository.countByStatus("На доработке"),
            projectRepository.countByStatus("Завершен"),
            documentRepository.count(),
            userRepository.count(),
            projectRepository.countByStatuses(),
            projectRepository.countByObjectTypes(),
            documentRepository.countByStatuses(),
            projectRepository.findNearestDeadlines()
    );
}
```

### Рисунок 2.28 — Реализация страницы списка проектов на React

### [Скрин кода](./img_16.png)

```javascript
export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);

  async function load() {
    setProjects(await api.projects());
  }

  useEffect(() => { load(); }, []);

  async function removeProject(event, id) {
    event.stopPropagation();
    if (window.confirm('Удалить проект?')) {
      await api.deleteProject(id);
      load();
    }
  }

  return (
      <DataTable
        title="Реестр проектов"
        rows={projects}
        filterField="status"
        filterLabel="Статус"
        onRowClick={(row) => navigate(`/projects/${row.id}`)}
        columns={[
          { field: 'name', headerName: 'Проект' },
          { field: 'customer', headerName: 'Заказчик' },
          { field: 'objectType', headerName: 'Тип объекта' },
          { field: 'managerName', headerName: 'Руководитель' },
          { field: 'status', headerName: 'Статус', render: (row) => <StatusChip status={row.status} /> },
          { field: 'documentsCount', headerName: 'Документы' },
        ]}
      />
  );
}
```

### Рисунок 2.29 — Реализация формы создания проекта на React

### [Скрин кода](./img_17.png)

```javascript
async function submit(event) {
  event.preventDefault();
  const payload = {
    ...project,
    managerId: Number(currentUser?.role === 'PROJECT_MANAGER' ? currentUser.id : project.managerId),
    engineerIds: project.engineerIds.map(Number),
    startDate: project.startDate || null,
    plannedFinishDate: project.plannedFinishDate || null,
    actualFinishDate: project.actualFinishDate || null,
  };
  const saved = isEdit ? await api.updateProject(id, payload) : await api.createProject(payload);
  navigate("/projects/" + saved.id);
}
```

### Листинг кода программного продукта страниц на 3-4.

```java
public List<ProjectResponse> findAllFor(User user) {
    return projectRepository.findAvailableForUser(user.id(), user.role()).stream().map(this::toResponse).toList();
}

public List<ProjectResponse> findAll() {
    return projectRepository.findAll().stream().map(this::toResponse).toList();
}

public List<ProjectResponse> findByUserId(Long userId) {
    return projectRepository.findByUserId(userId).stream().map(this::toResponse).toList();
}

public ProjectResponse findById(Long id) {
    return toResponse(getProject(id));
}

public Project getProject(Long id) {
    return projectRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Проект не найден"));
}

public ProjectResponse create(ProjectRequest request) {
    Long id = projectRepository.create(normalize(request));
    return findById(id);
}

public ProjectResponse update(Long id, ProjectRequest request) {
    projectRepository.update(id, normalize(request));
    return findById(id);
}

public ProjectResponse updateStatus(Long id, String status, User user) {
    Project project = getProject(id);
    if ("ENGINEER".equals(user.role()) && (!ENGINEER_EDIT_STATUSES.contains(project.status()) || !"На проверке".equals(status))) {
        throw new IllegalArgumentException("Инженер может отправлять на проверку только проекты в работе или на доработке");
    }
    projectRepository.updateStatus(id, status);
    return findById(id);
}

public boolean canOpenProjectChat(Long projectId, User user) {
    return "ADMIN".equals(user.role()) || projectRepository.isParticipant(projectId, user.id());
}

public ProjectResponse toResponse(Project project) {
    User manager = userService.getUser(project.managerId());
    var engineers = projectRepository.findEngineerIds(project.id()).stream()
            .map(userService::getUser)
            .map(userService::toResponse)
            .toList();
    return new ProjectResponse(
            project.id(),
            project.name(),
            project.description(),
            project.customer(),
            project.address(),
            project.objectType(),
            project.status(),
            project.managerId(),
            manager.fullName(),
            engineers,
            documentRepository.countByProjectId(project.id()),
            project.startDate(),
            project.plannedFinishDate(),
            project.actualFinishDate(),
            project.createdAt(),
            project.updatedAt()
    );
}

private ProjectRequest normalize(ProjectRequest request) {
    String status = request.status() == null || request.status().isBlank() ? "Новый" : request.status();
    return new ProjectRequest(
            request.name(),
            request.description(),
            request.customer(),
            request.address(),
            request.objectType(),
            status,
            request.managerId(),
            request.engineerIds(),
            request.startDate(),
            request.plannedFinishDate(),
            request.actualFinishDate()
    );
}

public Long create(ProjectRequest request) {
    Long id = jdbc.sql("""
                    INSERT INTO projects (name, description, customer, address, object_type, status, manager_id,
                                          start_date, planned_finish_date, actual_finish_date)
                    VALUES (:name, :description, :customer, :address, :objectType, :status, :managerId,
                            :startDate, :plannedFinishDate, :actualFinishDate)
                    RETURNING id
                    """)
            .param("name", request.name())
            .param("description", request.description())
            .param("customer", request.customer())
            .param("address", request.address())
            .param("objectType", request.objectType())
            .param("status", request.status())
            .param("managerId", request.managerId())
            .param("startDate", request.startDate())
            .param("plannedFinishDate", request.plannedFinishDate())
            .param("actualFinishDate", request.actualFinishDate())
            .query(Long.class)
            .single();
    replaceEngineers(id, request.engineerIds());
    return id;
}

public void update(Long id, ProjectRequest request) {
    jdbc.sql("""
                    UPDATE projects
                    SET name = :name, description = :description, customer = :customer, address = :address,
                        object_type = :objectType, status = :status, manager_id = :managerId,
                        start_date = :startDate, planned_finish_date = :plannedFinishDate,
                        actual_finish_date = :actualFinishDate, updated_at = CURRENT_TIMESTAMP
                    WHERE id = :id
                    """)
            .param("id", id)
            .param("name", request.name())
            .param("description", request.description())
            .param("customer", request.customer())
            .param("address", request.address())
            .param("objectType", request.objectType())
            .param("status", request.status())
            .param("managerId", request.managerId())
            .param("startDate", request.startDate())
            .param("plannedFinishDate", request.plannedFinishDate())
            .param("actualFinishDate", request.actualFinishDate())
            .update();
    replaceEngineers(id, request.engineerIds());
}

public void updateStatus(Long id, String status) {
    jdbc.sql("UPDATE projects SET status = :status, updated_at = CURRENT_TIMESTAMP WHERE id = :id")
            .param("id", id)
            .param("status", status)
            .update();
}

public List<Long> findEngineerIds(Long projectId) {
    return jdbc.sql("SELECT user_id FROM project_engineers WHERE project_id = :projectId ORDER BY user_id")
            .param("projectId", projectId)
            .query(Long.class)
            .list();
}

public boolean isParticipant(Long projectId, Long userId) {
    Integer count = jdbc.sql("""
                    SELECT count(*) FROM projects p
                    LEFT JOIN project_engineers pe ON pe.project_id = p.id
                    WHERE p.id = :projectId AND (p.manager_id = :userId OR pe.user_id = :userId)
                    """)
            .param("projectId", projectId)
            .param("userId", userId)
            .query(Integer.class)
            .single();
    return count > 0;
}

public List<ChartItem> countByStatuses() {
    return jdbc.sql("SELECT status AS label, count(*)::int AS value FROM projects GROUP BY status ORDER BY status")
            .query(ChartItem.class)
            .list();
}

public List<ProjectRiskItem> findNearestDeadlines() {
    return jdbc.sql("""
                    SELECT p.id, p.name, p.status, u.full_name AS manager_name,
                           CAST(p.planned_finish_date AS varchar) AS planned_finish_date
                    FROM projects p
                    JOIN app_users u ON u.id = p.manager_id
                    WHERE p.status <> 'Завершен' AND p.planned_finish_date IS NOT NULL
                    ORDER BY p.planned_finish_date
                    LIMIT 5
                    """)
            .query(ProjectRiskItem.class)
            .list();
}

private void replaceEngineers(Long projectId, List<Long> engineerIds) {
    jdbc.sql("DELETE FROM project_engineers WHERE project_id = :projectId").param("projectId", projectId).update();
    if (engineerIds == null) {
        return;
    }
    engineerIds.forEach(userId -> jdbc.sql("INSERT INTO project_engineers (project_id, user_id) VALUES (:projectId, :userId)")
            .param("projectId", projectId)
            .param("userId", userId)
            .update());
}
```
