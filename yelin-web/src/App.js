import { useMemo, useState } from 'react';
import './App.css';
import {
  auditLog,
  daysLeft,
  documents,
  filterDocumentsForReview,
  filterProjectsForRole,
  formatDate,
  formatDateTime,
  getDocumentById,
  getDocumentsByProject,
  getDocumentsByStage,
  getProjectById,
  getProjectMembers,
  getRemarksByDocument,
  getRemarksByProject,
  getRemarksByStage,
  getStagesByProject,
  getStageById,
  getTasksForRole,
  getVersionsByDocument,
  menuLabels,
  notifications as seedNotifications,
  objectTypes,
  projectStatuses,
  stages,
  projects as allProjects,
  remarks,
  roleLabels,
  roleMenu,
  remarkPriorities,
  remarkStatuses,
  seedCredentials,
  statusTone,
  users,
} from './mockData';

const defaultLogin = { email: 'admin@max-arh.local', password: 'password' };

const screenMeta = {
  dashboard: { title: 'Дашборд', subtitle: 'Общее состояние проектов и проблемных зон' },
  projects: { title: 'Проекты', subtitle: 'Список доступных проектов с фильтрами и быстрым доступом' },
  project: { title: 'Карточка проекта', subtitle: 'Подробная информация по выбранному проекту' },
  stage: { title: 'Карточка этапа', subtitle: 'Контроль этапа, документов и замечаний' },
  document: { title: 'Карточка документа', subtitle: 'Версии документа, замечания и статус проверки' },
  remarks: { title: 'Замечания', subtitle: 'Контроль замечаний по всем доступным объектам' },
  tasks: { title: 'Мои задачи', subtitle: 'Персональный список ближайших действий' },
  review: { title: 'Документы на проверке', subtitle: 'Очередь на проверку и повторную проверку' },
  notifications: { title: 'Уведомления', subtitle: 'События, которые касаются текущего пользователя' },
  users: { title: 'Пользователи', subtitle: 'Управление учетными записями и ролями' },
  audit: { title: 'Журнал действий', subtitle: 'История важных действий в системе' },
};

const emptyTextByScreen = {
  review: 'В очереди нет документов для проверки.',
  notifications: 'Уведомлений пока нет.',
  users: 'Нет пользователей, подходящих под фильтр.',
  audit: 'Журнал пуст.',
  remarks: 'Замечаний не найдено.',
  tasks: 'Задач нет.',
};

function App() {
  const [session, setSession] = useState(null);
  const [login, setLogin] = useState(defaultLogin);
  const [loginError, setLoginError] = useState('');
  const [activeScreen, setActiveScreen] = useState('dashboard');
  const [selectedProjectId, setSelectedProjectId] = useState(1);
  const [selectedStageId, setSelectedStageId] = useState(3);
  const [selectedDocumentId, setSelectedDocumentId] = useState(2);
  const [selectedRemarkId, setSelectedRemarkId] = useState(1);
  const [notificationsState, setNotificationsState] = useState(seedNotifications);

  const accessibleProjects = useMemo(() => {
    if (!session) return [];
    return filterProjectsForRole(session.role, session.email);
  }, [session]);

  const currentProject = useMemo(() => {
    if (!accessibleProjects.length) return null;
    return getProjectById(selectedProjectId) ?? accessibleProjects[0];
  }, [accessibleProjects, selectedProjectId]);

  const currentStages = useMemo(() => {
    if (!currentProject) return [];
    return getStagesByProject(currentProject.id);
  }, [currentProject]);

  const currentStage = useMemo(() => {
    if (!currentStages.length) return null;
    return getStageById(selectedStageId) ?? currentStages[0];
  }, [currentStages, selectedStageId]);

  const currentDocuments = useMemo(() => {
    if (!currentProject) return [];
    return getDocumentsByProject(currentProject.id);
  }, [currentProject]);

  const currentDocument = useMemo(() => {
    if (!currentDocuments.length) return null;
    return getDocumentById(selectedDocumentId) ?? currentDocuments[0];
  }, [currentDocuments, selectedDocumentId]);

  const currentRemark = useMemo(() => {
    return remarks.find((remark) => remark.id === selectedRemarkId) ?? remarks[0];
  }, [selectedRemarkId]);

  if (!session) {
    return (
      <LoginScreen
        login={login}
        setLogin={setLogin}
        error={loginError}
        onSubmit={() => {
          const account = users.find((user) => user.email === login.email);
          const credentials = seedCredentials[login.email];

          if (!account || !credentials || credentials.password !== login.password) {
            setLoginError('Неверный email или пароль.');
            return;
          }

          setSession(account);
          setActiveScreen('dashboard');
          setSelectedProjectId(1);
          setSelectedStageId(3);
          setSelectedDocumentId(2);
          setSelectedRemarkId(1);
          setLoginError('');
        }}
      />
    );
  }

  const visibleScreens = roleMenu[session.role] ?? roleMenu.EXECUTOR;
  const projectsForRole = accessibleProjects;
  const roleNotifications = notificationsState.filter((notification) => notification.userEmail === session.email);
  const projectRemarks = currentProject ? getRemarksByProject(currentProject.id) : [];
  const projectMembers = currentProject ? getProjectMembers(currentProject.id) : [];
  const stageDocuments = currentStage ? getDocumentsByStage(currentStage.id) : [];
  const stageRemarks = currentStage ? getRemarksByStage(currentStage.id) : [];
  const documentVersions = currentDocument ? getVersionsByDocument(currentDocument.id) : [];
  const documentRemarks = currentDocument ? getRemarksByDocument(currentDocument.id) : [];

  const screen = activeScreen;
  const meta = screenMeta[screen] ?? screenMeta.dashboard;

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">MA</div>
          <div>
            <div className="brand-title">MAX-ARCH Control</div>
            <div className="brand-subtitle">Project review workspace</div>
          </div>
        </div>

        <nav className="nav">
          {visibleScreens.map((item) => (
            <button
              key={item}
              className={`nav-item ${screen === item ? 'active' : ''}`}
              type="button"
              onClick={() => setActiveScreen(item)}
            >
              <span>{menuLabels[item]}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-note">
          <div className="sidebar-note-label">Текущая роль</div>
          <div className="sidebar-note-value">{roleLabels[session.role]}</div>
          <div className="sidebar-note-hint">Доступы меняются в зависимости от учетной записи.</div>
        </div>
      </aside>

      <main className="workspace">
        <header className="topbar">
          <div>
            <div className="eyebrow">MAX-ARCH Control</div>
            <h1>{meta.title}</h1>
            <p>{meta.subtitle}</p>
          </div>

          <div className="topbar-actions">
            <button className="ghost-button" type="button" onClick={() => setActiveScreen('notifications')}>
              Уведомления <span className="badge">{roleNotifications.filter((item) => !item.read).length}</span>
            </button>
            <div className="user-chip">
              <div className="avatar">{session.fullName.split(' ').map((part) => part[0]).slice(0, 2).join('')}</div>
              <div>
                <div className="user-chip-name">{session.fullName}</div>
                <div className="user-chip-role">{roleLabels[session.role]}</div>
              </div>
            </div>
            <button
              className="ghost-button"
              type="button"
              onClick={() => {
                setSession(null);
                setLogin(defaultLogin);
                setLoginError('');
              }}
            >
              Выйти
            </button>
          </div>
        </header>

        <section className="screen">
          {screen === 'dashboard' && (
            <DashboardScreen
              projects={projectsForRole}
              onOpenProject={(projectId) => {
                setSelectedProjectId(projectId);
                setActiveScreen('project');
              }}
            />
          )}

          {screen === 'projects' && (
            <ProjectsScreen
              role={session.role}
              projects={projectsForRole}
              onOpenProject={(projectId) => {
                setSelectedProjectId(projectId);
                setActiveScreen('project');
              }}
            />
          )}

          {screen === 'project' && currentProject && (
            <ProjectScreen
              project={currentProject}
              members={projectMembers}
              stages={currentStages}
              documents={currentDocuments}
              remarks={projectRemarks}
              history={auditLog}
              onOpenStage={(stageId) => {
                setSelectedStageId(stageId);
                setActiveScreen('stage');
              }}
              onOpenDocument={(documentId) => {
                setSelectedDocumentId(documentId);
                setActiveScreen('document');
              }}
            />
          )}

          {screen === 'stage' && currentStage && currentProject && (
            <StageScreen
              project={currentProject}
              stage={currentStage}
              documents={stageDocuments}
              remarks={stageRemarks}
              history={auditLog}
              onOpenDocument={(documentId) => {
                setSelectedDocumentId(documentId);
                setActiveScreen('document');
              }}
              onOpenProject={() => setActiveScreen('project')}
            />
          )}

          {screen === 'document' && currentDocument && currentProject && currentStage && (
            <DocumentScreen
              project={currentProject}
              stage={currentStage}
              document={currentDocument}
              versions={documentVersions}
              remarks={documentRemarks}
              onOpenRemark={(remarkId) => {
                setSelectedRemarkId(remarkId);
                setActiveScreen('remarks');
              }}
            />
          )}

          {screen === 'remarks' && (
            <RemarksScreen
              role={session.role}
              userEmail={session.email}
              onOpenProject={(projectId) => {
                setSelectedProjectId(projectId);
                setActiveScreen('project');
              }}
              onOpenDocument={(documentId) => {
                setSelectedDocumentId(documentId);
                setActiveScreen('document');
              }}
              onSelectRemark={(remarkId) => setSelectedRemarkId(remarkId)}
              selectedRemark={currentRemark}
            />
          )}

          {screen === 'tasks' && <TasksScreen role={session.role} />}

          {screen === 'review' && <ReviewScreen role={session.role} />}

          {screen === 'notifications' && (
            <NotificationsScreen
              notifications={roleNotifications}
              onToggleRead={(id) => {
                setNotificationsState((current) =>
                  current.map((notification) => (notification.id === id ? { ...notification, read: !notification.read } : notification)),
                );
              }}
              onMarkAllRead={() => {
                setNotificationsState((current) =>
                  current.map((notification) =>
                    notification.userEmail === session.email ? { ...notification, read: true } : notification,
                  ),
                );
              }}
              onOpenObject={(link) => {
                const projectMatch = link.match(/projects\/(\d+)/);
                const documentMatch = link.match(/documents\/(\d+)/);
                const remarkMatch = link.match(/remarks\/(\d+)/);

                if (projectMatch) {
                  setSelectedProjectId(Number(projectMatch[1]));
                  setActiveScreen('project');
                } else if (documentMatch) {
                  setSelectedDocumentId(Number(documentMatch[1]));
                  setActiveScreen('document');
                } else if (remarkMatch) {
                  setSelectedRemarkId(Number(remarkMatch[1]));
                  setActiveScreen('remarks');
                }
              }}
            />
          )}

          {screen === 'users' && session.role === 'ADMIN' && <UsersScreen />}

          {screen === 'audit' && session.role === 'ADMIN' && <AuditScreen />}

          {!['dashboard', 'projects', 'project', 'stage', 'document', 'remarks', 'tasks', 'review', 'notifications', 'users', 'audit'].includes(screen) && (
            <EmptyScreen title="Экран недоступен" text="У текущей роли нет доступа к выбранному разделу." />
          )}
        </section>
      </main>
    </div>
  );
}

function LoginScreen({ login, setLogin, error, onSubmit }) {
  return (
    <div className="login-screen">
      <div className="login-card">
        <div className="login-badge">MAX-ARCH Control</div>
        <h1>Вход в систему</h1>
        <p>Демо-доступы уже предзаполнены, можно сразу войти в разные роли.</p>

        <label className="field">
          <span>Email</span>
          <input
            type="email"
            value={login.email}
            onChange={(event) => setLogin((current) => ({ ...current, email: event.target.value }))}
            placeholder="email@company.com"
          />
        </label>

        <label className="field">
          <span>Пароль</span>
          <input
            type="password"
            value={login.password}
            onChange={(event) => setLogin((current) => ({ ...current, password: event.target.value }))}
            placeholder="Пароль"
          />
        </label>

        {error && <div className="alert">{error}</div>}

        <button className="primary-button" type="button" onClick={onSubmit}>
          Войти
        </button>

        <div className="credentials-grid">
          {Object.entries(seedCredentials).map(([email, credential]) => (
            <button
              key={email}
              type="button"
              className="credential-card"
              onClick={() => setLogin({ email, password: credential.password })}
            >
              <strong>{email}</strong>
              <span>{roleLabels[credential.role]}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function DashboardScreen({ projects, onOpenProject }) {
  const visibleProjectIds = new Set(projects.map((project) => project.id));
  const roleStages = stages.filter((stage) => visibleProjectIds.has(stage.projectId));
  const roleDocuments = documents.filter((document) => visibleProjectIds.has(document.projectId));
  const roleRemarks = remarks.filter((remark) => visibleProjectIds.has(remark.projectId));
  const countByStatus = (status) => projects.filter((project) => project.status === status).length;

  const stats = [
    { label: 'Всего проектов', value: projects.length, tone: 'neutral' },
    { label: 'Проектов в работе', value: countByStatus('В работе'), tone: 'info' },
    { label: 'Проектов на проверке', value: countByStatus('На проверке'), tone: 'info' },
    { label: 'Просрочено', value: countByStatus('Просрочен'), tone: 'error' },
    { label: 'Открытых замечаний', value: roleRemarks.filter((item) => item.status === 'Открыто').length, tone: 'error' },
    { label: 'Критических замечаний', value: roleRemarks.filter((item) => item.priority === 'Критический').length, tone: 'error' },
    { label: 'Документов на проверке', value: roleDocuments.filter((document) => document.status === 'На проверке' || document.status === 'На повторной проверке').length, tone: 'info' },
    { label: 'Этапов с дедлайном', value: roleStages.filter((stage) => daysLeft(stage.deadline) <= 7 && daysLeft(stage.deadline) >= 0).length, tone: 'warning' },
  ];

  return (
    <div className="screen-grid">
      <div className="stats-grid">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <div className="panel">
        <div className="panel-header">
          <h2>Таблица проектов</h2>
          <span className="panel-hint">Доступные проекты текущей роли</span>
        </div>
        <DataTable
          columns={['Название', 'Заказчик', 'Текущий этап', 'Готовность', 'Замечания', 'Дедлайн', 'Статус', 'Руководитель']}
          rows={projects.map((project) => [
            project.name,
            project.customer,
            project.currentStage,
            `${project.completionPercent}%`,
            project.openRemarksCount,
            formatDate(project.plannedFinishDate),
            <StatusPill key={`${project.id}-status`} value={project.status} />,
            project.managerName,
          ])}
          onRowClick={(rowIndex) => onOpenProject(projects[rowIndex].id)}
        />
      </div>

      <div className="dual-grid">
        <Panel title="Ближайшие дедлайны" hint="Сколько дней осталось до контрольной даты">
          <DataList
            items={roleStages
              .filter((stage) => stage.deadline)
              .slice(0, 3)
              .map((stage) => ({
                title: stage.name,
                lines: [stage.responsible, `Дедлайн: ${formatDate(stage.deadline)}`, `${daysLeft(stage.deadline)} дн.`],
              }))}
          />
        </Panel>

        <Panel title="Документы на проверке" hint="Последние документы в очереди">
          <DataList
            items={roleDocuments
              .filter((document) => document.status === 'На проверке' || document.status === 'На повторной проверке')
              .slice(0, 3)
              .map((document) => ({
                title: document.name,
                lines: [document.type, `Версия: v${document.currentVersion}`, `Загрузил: ${document.uploadedBy}`],
              }))}
          />
        </Panel>
      </div>

      <div className="dual-grid">
        <Panel title="Последние действия" hint="Что происходило в системе">
          <DataList
            items={auditLog.slice(0, 4).map((entry) => ({
              title: `${entry.user} · ${entry.action}`,
              lines: [entry.objectName, formatDateTime(entry.createdAt)],
            }))}
          />
        </Panel>

        <Panel title="Сигналы качества" hint="Что требует внимания">
          <div className="signal-stack">
            <SignalRow label="Открытые замечания" value={roleRemarks.filter((item) => item.status === 'Открыто').length} tone="error" />
            <SignalRow label="Исправляется" value={roleRemarks.filter((item) => item.status === 'В работе').length} tone="warning" />
            <SignalRow label="Критические замечания" value={roleRemarks.filter((item) => item.priority === 'Критический').length} tone="error" />
            <SignalRow label="Готово к проверке" value={roleDocuments.filter((document) => document.status === 'На проверке').length} tone="info" />
          </div>
        </Panel>
      </div>
    </div>
  );
}

function ProjectsScreen({ role, projects, onOpenProject }) {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('Все');
  const [objectType, setObjectType] = useState('Все');

  const filtered = projects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(search.toLowerCase()) ||
      project.customer.toLowerCase().includes(search.toLowerCase()) ||
      project.address.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = status === 'Все' || project.status === status;
    const matchesType = objectType === 'Все' || project.objectType === objectType;
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="screen-grid">
      <div className="toolbar">
        <input className="toolbar-input" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Поиск по проектам" />
        <select className="toolbar-select" value={status} onChange={(event) => setStatus(event.target.value)}>
          <option value="Все">Все статусы</option>
          {projectStatuses.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        <select className="toolbar-select" value={objectType} onChange={(event) => setObjectType(event.target.value)}>
          <option value="Все">Все типы</option>
          {objectTypes.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        <button className="primary-button" type="button" disabled={!['ADMIN', 'PROJECT_MANAGER'].includes(role)}>
          Создать проект
        </button>
      </div>

      <div className="panel">
        <DataTable
          columns={['Название', 'Заказчик', 'Адрес', 'Тип объекта', 'Руководитель', 'Текущий этап', 'Готовность', 'Статус', 'Дедлайн', 'Замечания', 'Дата создания']}
          rows={filtered.map((project) => [
            project.name,
            project.customer,
            project.address,
            project.objectType,
            project.managerName,
            project.currentStage,
            `${project.completionPercent}%`,
            <StatusPill key={`${project.id}-status`} value={project.status} />,
            formatDate(project.plannedFinishDate),
            project.openRemarksCount,
            formatDate(project.startDate),
          ])}
          onRowClick={(rowIndex) => onOpenProject(filtered[rowIndex].id)}
          emptyText="Проекты не найдены."
        />
      </div>
    </div>
  );
}

function ProjectScreen({ project, members, stages, documents, remarks, history, onOpenStage, onOpenDocument }) {
  return (
    <div className="screen-grid">
      <div className="hero-card">
        <div>
          <div className="eyebrow">Проект #{project.id}</div>
          <h2>{project.name}</h2>
          <p>{project.description}</p>
        </div>
        <div className="hero-metrics">
          <Metric label="Статус" value={<StatusPill value={project.status} />} />
          <Metric label="Готовность" value={`${project.completionPercent}%`} />
          <Metric label="Текущий этап" value={project.currentStage} />
          <Metric label="Дедлайн" value={formatDate(project.plannedFinishDate)} />
        </div>
      </div>

      <div className="dual-grid">
        <Panel title="Участники" hint="Команда проекта">
          <div className="simple-list">
            {members.map((member) => (
              <div key={member.email} className="simple-row">
                <div>
                  <strong>{member.fullName}</strong>
                  <div>{member.positionTitle}</div>
                </div>
                <div className="stack-right">
                  <StatusPill value={member.role} />
                  <span>{member.email}</span>
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="История действий" hint="Последние записи журнала">
          <DataList
            items={history.slice(0, 4).map((entry) => ({
              title: `${entry.user} · ${entry.action}`,
              lines: [entry.objectName, formatDateTime(entry.createdAt)],
            }))}
          />
        </Panel>
      </div>

      <Panel title="Этапы проекта" hint="Структура проекта и контроль сроков">
        <DataTable
          columns={['№', 'Название', 'Ответственный', 'Статус', 'Старт', 'Дедлайн', 'Завершение', 'Документы', 'Замечания', 'Готовность']}
          rows={stages.map((stage) => [
            stage.sortOrder,
            stage.name,
            stage.responsible,
            <StatusPill key={`${stage.id}-status`} value={stage.status} />,
            formatDate(stage.startDate),
            formatDate(stage.deadline),
            formatDate(stage.finishDate),
            stage.documentsCount,
            stage.openRemarksCount,
            `${stage.completionPercent}%`,
          ])}
          onRowClick={(rowIndex) => onOpenStage(stages[rowIndex].id)}
        />
      </Panel>

      <div className="dual-grid">
        <Panel title="Документы проекта" hint="Доступные материалы">
          <DataTable
            columns={['Название', 'Этап', 'Тип', 'Версия', 'Статус', 'Автор', 'Загрузка']}
            rows={documents.map((document) => [
              document.name,
              document.stageName,
              document.type,
              `v${document.currentVersion}`,
              <StatusPill key={`${document.id}-status`} value={document.status} />,
              document.uploadedBy,
              formatDateTime(document.uploadedAt),
            ])}
            onRowClick={(rowIndex) => onOpenDocument(documents[rowIndex].id)}
          />
        </Panel>

        <Panel title="Замечания проекта" hint="Текущие и закрытые замечания">
          <DataTable
            columns={['Текст', 'Документ', 'Этап', 'Приоритет', 'Ответственный', 'Статус', 'Срок']}
            rows={remarks.map((remark) => [
              remark.text,
              remark.documentName || '—',
              remark.stageName,
              <StatusPill key={`${remark.id}-priority`} value={remark.priority} />,
              remark.responsible,
              <StatusPill key={`${remark.id}-status`} value={remark.status} />,
              formatDate(remark.fixDeadline),
            ])}
          />
        </Panel>
      </div>
    </div>
  );
}

function StageScreen({ project, stage, documents, remarks, history, onOpenDocument, onOpenProject }) {
  return (
    <div className="screen-grid">
      <div className="hero-card">
        <div>
          <div className="eyebrow">{project.name}</div>
          <h2>{stage.name}</h2>
          <p>{stage.description}</p>
        </div>
        <div className="hero-metrics">
          <Metric label="Ответственный" value={stage.responsible} />
          <Metric label="Статус" value={<StatusPill value={stage.status} />} />
          <Metric label="Дедлайн" value={formatDate(stage.deadline)} />
          <Metric label="Готовность" value={`${stage.completionPercent}%`} />
        </div>
      </div>

      <div className="panel-actions">
        <button className="ghost-button" type="button" onClick={onOpenProject}>
          Назад к проекту
        </button>
        <button className="primary-button" type="button">
          Загрузить документ
        </button>
        <button className="ghost-button" type="button">
          Отправить этап на проверку
        </button>
        <button className="ghost-button" type="button">
          Принять этап
        </button>
      </div>

      <div className="dual-grid">
        <Panel title="Документы этапа" hint="Материалы, загруженные в этот этап">
          <DataTable
            columns={['Название', 'Тип', 'Версия', 'Статус', 'Автор', 'Дата', 'Замечания']}
            rows={documents.map((document) => [
              document.name,
              document.type,
              `v${document.currentVersion}`,
              <StatusPill key={`${document.id}-status`} value={document.status} />,
              document.uploadedBy,
              formatDateTime(document.uploadedAt),
              getRemarksByDocument(document.id).length,
            ])}
            onRowClick={(rowIndex) => onOpenDocument(documents[rowIndex].id)}
          />
        </Panel>

        <Panel title="Замечания этапа" hint="Точки контроля по текущему этапу">
          <DataTable
            columns={['Текст', 'Документ', 'Автор', 'Ответственный', 'Приоритет', 'Статус', 'Срок']}
            rows={remarks.map((remark) => [
              remark.text,
              remark.documentName,
              remark.author,
              remark.responsible,
              <StatusPill key={`${remark.id}-priority`} value={remark.priority} />,
              <StatusPill key={`${remark.id}-status`} value={remark.status} />,
              formatDate(remark.fixDeadline),
            ])}
          />
        </Panel>
      </div>

      <Panel title="История действий этапа" hint="Лента событий">
        <DataList
          items={history.slice(0, 5).map((entry) => ({
            title: `${entry.user} · ${entry.action}`,
            lines: [entry.description, formatDateTime(entry.createdAt)],
          }))}
        />
      </Panel>
    </div>
  );
}

function DocumentScreen({ project, stage, document, versions, remarks, onOpenRemark }) {
  return (
    <div className="screen-grid">
      <div className="hero-card">
        <div>
          <div className="eyebrow">{project.name}</div>
          <h2>{document.name}</h2>
          <p>
            Этап: {stage.name}. Тип документа: {document.type}.
          </p>
        </div>
        <div className="hero-metrics">
          <Metric label="Статус" value={<StatusPill value={document.status} />} />
          <Metric label="Версия" value={`v${document.currentVersion}`} />
          <Metric label="Автор" value={document.uploadedBy} />
          <Metric label="Дата загрузки" value={formatDateTime(document.uploadedAt)} />
        </div>
      </div>

      <div className="panel-actions">
        <button className="primary-button" type="button">
          Скачать
        </button>
        <button className="ghost-button" type="button">
          Открыть / Просмотреть
        </button>
        <button className="ghost-button" type="button">
          Загрузить новую версию
        </button>
        <button className="ghost-button" type="button">
          Отправить на проверку
        </button>
      </div>

      <div className="dual-grid">
        <Panel title="Файл" hint="Информация о прикрепленном файле">
          <div className="file-card">
            <div className="file-name">{document.fileName || `${document.name}.pdf`}</div>
            <div className="file-meta">
              <span>{document.extension}</span>
              <span>{(document.size / 1024 / 1024).toFixed(1)} МБ</span>
            </div>
            <div className="file-comment">{document.comment}</div>
          </div>
        </Panel>

        <Panel title="История версий" hint="Версионность без удаления истории">
          <DataTable
            columns={['Версия', 'Файл', 'Автор', 'Дата', 'Комментарий']}
            rows={versions.map((version) => [
              `v${version.version}`,
              version.fileName,
              version.uploadedBy,
              formatDateTime(version.uploadedAt),
              version.comment,
            ])}
          />
        </Panel>
      </div>

      <Panel title="Замечания" hint="Все замечания по документу">
        <DataTable
          columns={['Текст', 'Автор', 'Ответственный', 'Приоритет', 'Статус', 'Срок', 'Комментарий']}
          rows={remarks.map((remark) => [
            remark.text,
            remark.author,
            remark.responsible,
            <StatusPill key={`${remark.id}-priority`} value={remark.priority} />,
            <StatusPill key={`${remark.id}-status`} value={remark.status} />,
            formatDate(remark.fixDeadline),
            remark.executorComment || '—',
          ])}
          onRowClick={(rowIndex) => onOpenRemark(remarks[rowIndex].id)}
        />
      </Panel>
    </div>
  );
}

function RemarksScreen({ role, userEmail, onOpenProject, onOpenDocument, onSelectRemark, selectedRemark }) {
  const [search, setSearch] = useState('');
  const [priority, setPriority] = useState('Все');
  const [status, setStatus] = useState('Все');

  const visibleRemarks = remarks.filter((remark) => {
    const projectsForUser = filterProjectsForRole(role, userEmail);
    const projectVisible = role === 'ADMIN' || projectsForUser.some((project) => project.id === remark.projectId);
    const roleVisible =
      role === 'ADMIN' ||
      (role === 'PROJECT_MANAGER' && projectVisible) ||
      (role === 'EXECUTOR' && remark.responsible === users.find((user) => user.email === userEmail)?.fullName) ||
      (role === 'REVIEWER' && remark.author === users.find((user) => user.email === userEmail)?.fullName);

    const matchesSearch = remark.text.toLowerCase().includes(search.toLowerCase()) || remark.documentName.toLowerCase().includes(search.toLowerCase());
    const matchesPriority = priority === 'Все' || remark.priority === priority;
    const matchesStatus = status === 'Все' || remark.status === status;

    return roleVisible && matchesSearch && matchesPriority && matchesStatus;
  });

  return (
    <div className="screen-grid">
      <div className="toolbar">
        <input className="toolbar-input" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Поиск замечаний" />
        <select className="toolbar-select" value={priority} onChange={(event) => setPriority(event.target.value)}>
          <option value="Все">Все приоритеты</option>
          {remarkPriorities.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        <select className="toolbar-select" value={status} onChange={(event) => setStatus(event.target.value)}>
          <option value="Все">Все статусы</option>
          {remarkStatuses.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      <div className="stats-grid compact">
        {['Всего', 'Открыто', 'В работе', 'Исправлено', 'На повторной проверке', 'Закрыто', 'Критические'].map((label) => (
          <StatCard
            key={label}
            label={label}
            value={
              label === 'Всего'
                ? visibleRemarks.length
                : label === 'Критические'
                  ? visibleRemarks.filter((item) => item.priority === 'Критический').length
                  : visibleRemarks.filter((item) => item.status === label).length
            }
          />
        ))}
      </div>

      <Panel title="Список замечаний" hint="Клик по строке открывает выбранное замечание">
        <DataTable
          columns={['Текст', 'Проект', 'Этап', 'Документ', 'Автор', 'Ответственный', 'Приоритет', 'Статус', 'Срок']}
          rows={visibleRemarks.map((remark) => [
            remark.text,
            allProjects.find((project) => project.id === remark.projectId)?.name ?? '—',
            remark.stageName,
            remark.documentName,
            remark.author,
            remark.responsible,
            <StatusPill key={`${remark.id}-priority`} value={remark.priority} />,
            <StatusPill key={`${remark.id}-status`} value={remark.status} />,
            formatDate(remark.fixDeadline),
          ])}
          onRowClick={(rowIndex) => onSelectRemark(visibleRemarks[rowIndex].id)}
          emptyText="Замечания не найдены."
        />
      </Panel>

      {selectedRemark && (
        <Panel title="Выбранное замечание" hint="Контекст для работы">
          <div className="remark-detail">
            <strong>{selectedRemark.text}</strong>
            <div>Автор: {selectedRemark.author}</div>
            <div>Ответственный: {selectedRemark.responsible}</div>
            <div>Приоритет: {selectedRemark.priority}</div>
            <div>Статус: {selectedRemark.status}</div>
            <div>Срок исправления: {formatDate(selectedRemark.fixDeadline)}</div>
            <div>Комментарий исполнителя: {selectedRemark.executorComment || '—'}</div>
            <div className="remark-actions">
              <button className="primary-button" type="button" onClick={() => onOpenProject(selectedRemark.projectId)}>
                Перейти к проекту
              </button>
              <button className="ghost-button" type="button" onClick={() => onOpenDocument(selectedRemark.documentId)}>
                Перейти к документу
              </button>
            </div>
          </div>
        </Panel>
      )}
    </div>
  );
}

function TasksScreen({ role }) {
  const tasks = getTasksForRole(role);

  return (
    <div className="screen-grid">
      <div className="stats-grid compact">
        <StatCard label="Задач всего" value={tasks.length} />
        <StatCard label="Критических" value={tasks.filter((task) => task.priority === 'Критический').length} tone="error" />
        <StatCard label="На сегодня" value={tasks.filter((task) => task.deadline === '2026-05-11').length} tone="warning" />
      </div>

      <Panel title="Мои задачи" hint="Персональный список действий">
        <DataTable
          columns={['Тип', 'Проект', 'Этап', 'Документ', 'Описание', 'Приоритет', 'Дедлайн', 'Статус']}
          rows={tasks.map((task) => [
            task.type,
            task.project,
            task.stage || '—',
            task.document || '—',
            task.description,
            <StatusPill key={`${task.id}-priority`} value={task.priority} />,
            formatDate(task.deadline),
            <StatusPill key={`${task.id}-status`} value={task.status} />,
          ])}
        />
      </Panel>
    </div>
  );
}

function ReviewScreen({ role }) {
  const [search, setSearch] = useState('');

  const queue = filterDocumentsForReview(role).filter((item) => item.name.toLowerCase().includes(search.toLowerCase()) || item.projectName.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="screen-grid">
      <div className="toolbar">
        <input className="toolbar-input" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Поиск документов" />
      </div>

      <div className="stats-grid compact">
        <StatCard label="Всего" value={queue.length} />
        <StatCard label="На проверке" value={queue.filter((item) => item.status === 'На проверке').length} tone="info" />
        <StatCard label="На повторной проверке" value={queue.filter((item) => item.status === 'На повторной проверке').length} tone="warning" />
      </div>

      <Panel title="Документы на проверке" hint="Очередь проверяющего и руководителя проекта">
        <DataTable
          columns={['Название', 'Проект', 'Этап', 'Тип', 'Версия', 'Автор', 'Дата отправки', 'Статус', 'Замечания']}
          rows={queue.map((item) => [
            item.name,
            item.projectName,
            item.stageName,
            item.documentType,
            `v${item.version}`,
            item.uploadedBy,
            formatDateTime(item.sentAt),
            <StatusPill key={`${item.id}-status`} value={item.status} />,
            item.remarksCount,
          ])}
          emptyText={emptyTextByScreen.review}
        />
      </Panel>
    </div>
  );
}

function NotificationsScreen({ notifications, onToggleRead, onMarkAllRead, onOpenObject }) {
  const unreadCount = notifications.filter((notification) => !notification.read).length;

  return (
    <div className="screen-grid">
      <div className="toolbar">
        <button className="primary-button" type="button" onClick={onMarkAllRead}>
          Отметить все как прочитанные
        </button>
        <span className="muted">Непрочитано: {unreadCount}</span>
      </div>

      <Panel title="Уведомления" hint="События по текущему пользователю">
        <div className="notification-stack">
          {notifications.length === 0 ? (
            <EmptyScreen title="Нет уведомлений" text={emptyTextByScreen.notifications} />
          ) : (
            notifications.map((notification) => (
              <button
                key={notification.id}
                type="button"
                className={`notification-item ${notification.read ? 'read' : 'unread'}`}
                onClick={() => {
                  onToggleRead(notification.id);
                  onOpenObject(notification.objectLink);
                }}
              >
                <div>
                  <strong>{notification.message}</strong>
                  <div>{formatDateTime(notification.createdAt)}</div>
                </div>
                <span>{notification.read ? 'Прочитано' : 'Не прочитано'}</span>
              </button>
            ))
          )}
        </div>
      </Panel>
    </div>
  );
}

function UsersScreen() {
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('Все');
  const [active, setActive] = useState('Все');

  const filtered = users.filter((user) => {
    const matchesSearch = user.fullName.toLowerCase().includes(search.toLowerCase()) || user.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = role === 'Все' || user.role === role;
    const matchesActive = active === 'Все' || (active === 'Активные' ? user.active : !user.active);
    return matchesSearch && matchesRole && matchesActive;
  });

  return (
    <div className="screen-grid">
      <div className="toolbar">
        <input className="toolbar-input" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Поиск пользователей" />
        <select className="toolbar-select" value={role} onChange={(event) => setRole(event.target.value)}>
          <option value="Все">Все роли</option>
          {Object.keys(roleLabels).map((item) => (
            <option key={item} value={item}>
              {roleLabels[item]}
            </option>
          ))}
        </select>
        <select className="toolbar-select" value={active} onChange={(event) => setActive(event.target.value)}>
          <option value="Все">Любой статус</option>
          <option value="Активные">Активные</option>
          <option value="Неактивные">Неактивные</option>
        </select>
        <button className="primary-button" type="button">
          Создать пользователя
        </button>
      </div>

      <Panel title="Пользователи" hint="Управление ролями и активностью">
        <DataTable
          columns={['ФИО', 'Email', 'Роль', 'Должность', 'Активность', 'Дата создания']}
          rows={filtered.map((user) => [
            user.fullName,
            user.email,
            roleLabels[user.role],
            user.positionTitle,
            <StatusPill key={`${user.id}-active`} value={user.active ? 'Активен' : 'Неактивен'} />,
            formatDateTime(user.createdAt),
          ])}
          emptyText={emptyTextByScreen.users}
        />
      </Panel>
    </div>
  );
}

function AuditScreen() {
  const [search, setSearch] = useState('');
  const [action, setAction] = useState('Все');

  const filtered = auditLog.filter((entry) => {
    const matchesSearch =
      entry.user.toLowerCase().includes(search.toLowerCase()) ||
      entry.objectName.toLowerCase().includes(search.toLowerCase()) ||
      entry.description.toLowerCase().includes(search.toLowerCase());
    const matchesAction = action === 'Все' || entry.action === action;
    return matchesSearch && matchesAction;
  });

  return (
    <div className="screen-grid">
      <div className="toolbar">
        <input className="toolbar-input" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Поиск по журналу" />
        <select className="toolbar-select" value={action} onChange={(event) => setAction(event.target.value)}>
          <option value="Все">Все действия</option>
          {[...new Set(auditLog.map((entry) => entry.action))].map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      <Panel title="Журнал действий" hint="Важные события системы">
        <DataTable
          columns={['Пользователь', 'Действие', 'Объект', 'Описание', 'Дата и время']}
          rows={filtered.map((entry) => [entry.user, entry.action, entry.objectName, entry.description, formatDateTime(entry.createdAt)])}
          emptyText={emptyTextByScreen.audit}
        />
      </Panel>
    </div>
  );
}

function Panel({ title, hint, children }) {
  return (
    <section className="panel">
      <div className="panel-header">
        <h2>{title}</h2>
        {hint && <span className="panel-hint">{hint}</span>}
      </div>
      {children}
    </section>
  );
}

function StatCard({ label, value, tone = 'neutral' }) {
  return (
    <div className={`stat-card tone-${tone}`}>
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
    </div>
  );
}

function StatusPill({ value }) {
  const tone = statusTone[value] || 'neutral';
  return <span className={`status-pill tone-${tone}`}>{value}</span>;
}

function DataTable({ columns, rows, onRowClick, emptyText = 'Данных нет.' }) {
  if (!rows.length) {
    return <EmptyScreen title="Нет данных" text={emptyText} />;
  }

  return (
    <div className="table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column}>{column}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} onClick={onRowClick ? () => onRowClick(rowIndex) : undefined} className={onRowClick ? 'clickable-row' : ''}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function DataList({ items }) {
  if (!items.length) {
    return <EmptyScreen title="Пусто" text="Нет записей для отображения." />;
  }

  return (
    <div className="data-list">
      {items.map((item, index) => (
        <div key={index} className="data-list-item">
          <strong>{item.title}</strong>
          {item.lines.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </div>
      ))}
    </div>
  );
}

function Metric({ label, value }) {
  return (
    <div className="metric">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function SignalRow({ label, value, tone }) {
  return (
    <div className={`signal-row tone-${tone}`}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function EmptyScreen({ title, text }) {
  return (
    <div className="empty-state">
      <strong>{title}</strong>
      <span>{text}</span>
    </div>
  );
}

export default App;
