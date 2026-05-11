export const seedCredentials = {
  'admin@max-arh.local': { password: 'password', role: 'ADMIN' },
  'manager@max-arh.local': { password: 'password', role: 'PROJECT_MANAGER' },
  'architect@max-arh.local': { password: 'password', role: 'EXECUTOR' },
  'reviewer@max-arh.local': { password: 'password', role: 'REVIEWER' },
};

export const users = [
  { id: 1, fullName: 'Иванов Иван Иванович', email: 'admin@max-arh.local', role: 'ADMIN', positionTitle: 'Администратор', active: true, createdAt: '2026-05-01T09:00:00' },
  { id: 2, fullName: 'Петров Петр Петрович', email: 'manager@max-arh.local', role: 'PROJECT_MANAGER', positionTitle: 'Руководитель проекта', active: true, createdAt: '2026-05-01T09:05:00' },
  { id: 3, fullName: 'Сидоров Сергей Сергеевич', email: 'architect@max-arh.local', role: 'EXECUTOR', positionTitle: 'Архитектор', active: true, createdAt: '2026-05-01T09:10:00' },
  { id: 4, fullName: 'Кузнецова Анна Андреевна', email: 'reviewer@max-arh.local', role: 'REVIEWER', positionTitle: 'Проверяющий', active: true, createdAt: '2026-05-01T09:15:00' },
];

export const projects = [
  {
    id: 1,
    name: 'Многоэтажный жилой дом',
    description: 'Жилой комплекс с подземным паркингом',
    customer: 'ООО «ГрадСтрой»',
    address: 'г. Самара, ул. Лесная, 12',
    objectType: 'Жилое здание',
    managerId: 2,
    managerName: 'Петров Петр Петрович',
    currentStage: 'Проектная документация',
    status: 'В работе',
    completionPercent: 50,
    startDate: '2026-05-01',
    plannedFinishDate: '2026-09-15',
    actualFinishDate: null,
    openRemarksCount: 2,
  },
  {
    id: 2,
    name: 'Административное здание',
    description: 'Офисный комплекс для регионального офиса',
    customer: 'АО «РегионИнвест»',
    address: 'г. Самара, ул. Набережная, 41',
    objectType: 'Административное здание',
    managerId: 2,
    managerName: 'Петров Петр Петрович',
    currentStage: 'Эскизный проект',
    status: 'На проверке',
    completionPercent: 33,
    startDate: '2026-04-18',
    plannedFinishDate: '2026-08-30',
    actualFinishDate: null,
    openRemarksCount: 1,
  },
  {
    id: 3,
    name: 'Реконструкция общественного здания',
    description: 'Капитальная реконструкция объекта культуры',
    customer: 'МБУК «Центр культуры»',
    address: 'г. Тольятти, проспект Победы, 8',
    objectType: 'Реконструкция',
    managerId: 2,
    managerName: 'Петров Петр Петрович',
    currentStage: 'Рабочая документация',
    status: 'Просрочен',
    completionPercent: 66,
    startDate: '2026-03-10',
    plannedFinishDate: '2026-05-10',
    actualFinishDate: null,
    openRemarksCount: 2,
  },
];

export const projectMembers = [
  { projectId: 1, fullName: 'Петров Петр Петрович', role: 'PROJECT_MANAGER', positionTitle: 'Руководитель проекта', email: 'manager@max-arh.local' },
  { projectId: 1, fullName: 'Сидоров Сергей Сергеевич', role: 'EXECUTOR', positionTitle: 'Архитектор', email: 'architect@max-arh.local' },
  { projectId: 1, fullName: 'Кузнецова Анна Андреевна', role: 'REVIEWER', positionTitle: 'Проверяющий', email: 'reviewer@max-arh.local' },
  { projectId: 2, fullName: 'Петров Петр Петрович', role: 'PROJECT_MANAGER', positionTitle: 'Руководитель проекта', email: 'manager@max-arh.local' },
  { projectId: 2, fullName: 'Сидоров Сергей Сергеевич', role: 'EXECUTOR', positionTitle: 'Архитектор', email: 'architect@max-arh.local' },
  { projectId: 2, fullName: 'Кузнецова Анна Андреевна', role: 'REVIEWER', positionTitle: 'Проверяющий', email: 'reviewer@max-arh.local' },
  { projectId: 3, fullName: 'Петров Петр Петрович', role: 'PROJECT_MANAGER', positionTitle: 'Руководитель проекта', email: 'manager@max-arh.local' },
  { projectId: 3, fullName: 'Сидоров Сергей Сергеевич', role: 'EXECUTOR', positionTitle: 'Архитектор', email: 'architect@max-arh.local' },
  { projectId: 3, fullName: 'Кузнецова Анна Андреевна', role: 'REVIEWER', positionTitle: 'Проверяющий', email: 'reviewer@max-arh.local' },
];

export const stages = [
  { id: 1, projectId: 1, name: 'Предпроектная подготовка', description: 'Сбор исходных данных и обследование площадки', sortOrder: 1, responsible: 'Сидоров Сергей Сергеевич', status: 'Принят', startDate: '2026-05-01', deadline: '2026-05-10', finishDate: '2026-05-09', completionPercent: 100, documentsCount: 1, openRemarksCount: 0 },
  { id: 2, projectId: 1, name: 'Эскизный проект', description: 'Формирование концепции и вариантов планировок', sortOrder: 2, responsible: 'Сидоров Сергей Сергеевич', status: 'Принят', startDate: '2026-05-10', deadline: '2026-05-25', finishDate: '2026-05-24', completionPercent: 100, documentsCount: 1, openRemarksCount: 0 },
  { id: 3, projectId: 1, name: 'Проектная документация', description: 'Подготовка разделов ПД', sortOrder: 3, responsible: 'Сидоров Сергей Сергеевич', status: 'В работе', startDate: '2026-05-25', deadline: '2026-06-20', finishDate: null, completionPercent: 60, documentsCount: 3, openRemarksCount: 1 },
  { id: 4, projectId: 1, name: 'Рабочая документация', description: 'Выпуск рабочих чертежей', sortOrder: 4, responsible: 'Сидоров Сергей Сергеевич', status: 'Не начат', startDate: null, deadline: '2026-07-15', finishDate: null, completionPercent: 0, documentsCount: 0, openRemarksCount: 0 },
  { id: 5, projectId: 1, name: 'Проверка и согласование', description: 'Передача на проверку', sortOrder: 5, responsible: 'Кузнецова Анна Андреевна', status: 'Не начат', startDate: null, deadline: '2026-08-01', finishDate: null, completionPercent: 0, documentsCount: 0, openRemarksCount: 0 },
  { id: 6, projectId: 1, name: 'Завершение проекта', description: 'Финальная приемка', sortOrder: 6, responsible: 'Петров Петр Петрович', status: 'Не начат', startDate: null, deadline: '2026-09-15', finishDate: null, completionPercent: 0, documentsCount: 0, openRemarksCount: 0 },
  { id: 7, projectId: 2, name: 'Предпроектная подготовка', description: 'Сбор исходных данных и ТУ', sortOrder: 1, responsible: 'Сидоров Сергей Сергеевич', status: 'Принят', startDate: '2026-04-18', deadline: '2026-04-30', finishDate: '2026-04-29', completionPercent: 100, documentsCount: 1, openRemarksCount: 0 },
  { id: 8, projectId: 2, name: 'Эскизный проект', description: 'Схемы и основные планировочные решения', sortOrder: 2, responsible: 'Сидоров Сергей Сергеевич', status: 'На проверке', startDate: '2026-05-01', deadline: '2026-05-20', finishDate: null, completionPercent: 70, documentsCount: 1, openRemarksCount: 0 },
  { id: 9, projectId: 2, name: 'Проектная документация', description: 'Разработка альбома ПД', sortOrder: 3, responsible: 'Сидоров Сергей Сергеевич', status: 'Не начат', startDate: null, deadline: '2026-06-15', finishDate: null, completionPercent: 0, documentsCount: 0, openRemarksCount: 0 },
  { id: 10, projectId: 2, name: 'Рабочая документация', description: 'Рабочие чертежи', sortOrder: 4, responsible: 'Сидоров Сергей Сергеевич', status: 'Не начат', startDate: null, deadline: '2026-07-20', finishDate: null, completionPercent: 0, documentsCount: 0, openRemarksCount: 0 },
  { id: 11, projectId: 2, name: 'Проверка и согласование', description: 'Согласование со всеми участниками', sortOrder: 5, responsible: 'Кузнецова Анна Андреевна', status: 'Не начат', startDate: null, deadline: '2026-08-20', finishDate: null, completionPercent: 0, documentsCount: 0, openRemarksCount: 0 },
  { id: 12, projectId: 2, name: 'Завершение проекта', description: 'Передача итогового комплекта', sortOrder: 6, responsible: 'Петров Петр Петрович', status: 'Не начат', startDate: null, deadline: '2026-08-30', finishDate: null, completionPercent: 0, documentsCount: 0, openRemarksCount: 0 },
  { id: 13, projectId: 3, name: 'Предпроектная подготовка', description: 'Обследование и исходные данные', sortOrder: 1, responsible: 'Сидоров Сергей Сергеевич', status: 'Принят', startDate: '2026-03-10', deadline: '2026-03-28', finishDate: '2026-03-27', completionPercent: 100, documentsCount: 1, openRemarksCount: 0 },
  { id: 14, projectId: 3, name: 'Эскизный проект', description: 'Концепция реконструкции', sortOrder: 2, responsible: 'Сидоров Сергей Сергеевич', status: 'Принят', startDate: '2026-03-28', deadline: '2026-04-18', finishDate: '2026-04-17', completionPercent: 100, documentsCount: 1, openRemarksCount: 0 },
  { id: 15, projectId: 3, name: 'Проектная документация', description: 'Комплект ПД', sortOrder: 3, responsible: 'Сидоров Сергей Сергеевич', status: 'Есть замечания', startDate: '2026-04-18', deadline: '2026-05-10', finishDate: null, completionPercent: 80, documentsCount: 2, openRemarksCount: 2 },
  { id: 16, projectId: 3, name: 'Рабочая документация', description: 'Рабочие чертежи', sortOrder: 4, responsible: 'Сидоров Сергей Сергеевич', status: 'Исправляется', startDate: null, deadline: '2026-06-10', finishDate: null, completionPercent: 50, documentsCount: 1, openRemarksCount: 1 },
  { id: 17, projectId: 3, name: 'Проверка и согласование', description: 'Проверка корректировок', sortOrder: 5, responsible: 'Кузнецова Анна Андреевна', status: 'Не начат', startDate: null, deadline: '2026-07-01', finishDate: null, completionPercent: 0, documentsCount: 0, openRemarksCount: 0 },
  { id: 18, projectId: 3, name: 'Завершение проекта', description: 'Сдача объекта', sortOrder: 6, responsible: 'Петров Петр Петрович', status: 'Не начат', startDate: null, deadline: '2026-07-20', finishDate: null, completionPercent: 0, documentsCount: 0, openRemarksCount: 0 },
];

export const documents = [
  { id: 1, projectId: 1, stageId: 1, stageName: 'Предпроектная подготовка', name: 'Пояснительная записка', type: 'Пояснительная записка', currentVersion: 2, status: 'Принят', fileName: 'Poyasnitelnaia_zapiska_v2.pdf', extension: 'PDF', size: 1245120, uploadedBy: 'Сидоров Сергей Сергеевич', uploadedAt: '2026-05-12T10:00:00', comment: 'Уточнены исходные данные' },
  { id: 2, projectId: 1, stageId: 3, stageName: 'Проектная документация', name: 'План 1 этажа', type: 'План', currentVersion: 2, status: 'Есть замечания', fileName: 'Plan_1_etazha_v2.pdf', extension: 'PDF', size: 2380120, uploadedBy: 'Сидоров Сергей Сергеевич', uploadedAt: '2026-05-12T15:10:00', comment: 'Новая версия после замечаний' },
  { id: 3, projectId: 2, stageId: 8, stageName: 'Эскизный проект', name: 'Фасад главный', type: 'Фасад', currentVersion: 1, status: 'На проверке', fileName: 'Fasad_glavnyi_v1.pdf', extension: 'PDF', size: 1830120, uploadedBy: 'Сидоров Сергей Сергеевич', uploadedAt: '2026-05-11T14:20:00', comment: 'Передан на согласование' },
  { id: 4, projectId: 3, stageId: 15, stageName: 'Проектная документация', name: 'Архитектурные решения', type: 'Архитектурные решения', currentVersion: 3, status: 'Исправляется', fileName: 'AR_v3.pdf', extension: 'PDF', size: 2940120, uploadedBy: 'Сидоров Сергей Сергеевич', uploadedAt: '2026-05-11T09:10:00', comment: 'Корректировки по замечаниям' },
  { id: 5, projectId: 3, stageId: 15, stageName: 'Проектная документация', name: 'Схема генплана', type: 'Схема генплана', currentVersion: 2, status: 'На повторной проверке', fileName: 'Genplan_v2.pdf', extension: 'PDF', size: 2094120, uploadedBy: 'Сидоров Сергей Сергеевич', uploadedAt: '2026-05-11T10:30:00', comment: 'Обновленная схема' },
  { id: 6, projectId: 1, stageId: 3, stageName: 'Проектная документация', name: 'Рабочие чертежи АР', type: 'Рабочий чертеж', currentVersion: 1, status: 'Черновик', fileName: 'RAB_AR_v1.pdf', extension: 'PDF', size: 3184120, uploadedBy: 'Сидоров Сергей Сергеевич', uploadedAt: '2026-05-11T18:00:00', comment: 'Первичная загрузка' },
];

export const versions = [
  { id: 1, documentId: 1, version: 1, fileName: 'Poyasnitelnaia_zapiska_v1.pdf', uploadedBy: 'Сидоров Сергей Сергеевич', uploadedAt: '2026-05-10T10:00:00', comment: 'Первичная загрузка' },
  { id: 2, documentId: 1, version: 2, fileName: 'Poyasnitelnaia_zapiska_v2.pdf', uploadedBy: 'Сидоров Сергей Сергеевич', uploadedAt: '2026-05-12T09:30:00', comment: 'После замечаний' },
  { id: 3, documentId: 2, version: 1, fileName: 'Plan_1_etazha_v1.pdf', uploadedBy: 'Сидоров Сергей Сергеевич', uploadedAt: '2026-05-10T11:00:00', comment: 'Первичная загрузка' },
  { id: 4, documentId: 2, version: 2, fileName: 'Plan_1_etazha_v2.pdf', uploadedBy: 'Сидоров Сергей Сергеевич', uploadedAt: '2026-05-12T15:10:00', comment: 'Исправление замечаний' },
  { id: 5, documentId: 3, version: 1, fileName: 'Fasad_glavnyi_v1.pdf', uploadedBy: 'Сидоров Сергей Сергеевич', uploadedAt: '2026-05-11T14:20:00', comment: 'Передача на проверку' },
  { id: 6, documentId: 4, version: 1, fileName: 'AR_v1.pdf', uploadedBy: 'Сидоров Сергей Сергеевич', uploadedAt: '2026-05-09T12:00:00', comment: 'Первичная загрузка' },
  { id: 7, documentId: 4, version: 2, fileName: 'AR_v2.pdf', uploadedBy: 'Сидоров Сергей Сергеевич', uploadedAt: '2026-05-10T16:40:00', comment: 'Доработка по замечаниям' },
  { id: 8, documentId: 4, version: 3, fileName: 'AR_v3.pdf', uploadedBy: 'Сидоров Сергей Сергеевич', uploadedAt: '2026-05-11T09:10:00', comment: 'Повторная проверка' },
];

export const remarks = [
  { id: 1, projectId: 1, stageId: 3, documentId: 2, text: 'Уточнить размеры эвакуационного выхода.', author: 'Кузнецова Анна Андреевна', responsible: 'Сидоров Сергей Сергеевич', priority: 'Высокий', status: 'В работе', fixDeadline: '2026-05-18', executorComment: 'Готовлю корректировку' },
  { id: 2, projectId: 1, stageId: 3, documentId: 2, text: 'Исправить обозначение помещения на плане 1 этажа.', author: 'Кузнецова Анна Андреевна', responsible: 'Сидоров Сергей Сергеевич', priority: 'Средний', status: 'Исправлено', fixDeadline: '2026-05-17', executorComment: 'Обозначение исправлено' },
  { id: 3, projectId: 2, stageId: 8, documentId: 3, text: 'Проверить соответствие фасада утвержденной концепции.', author: 'Кузнецова Анна Андреевна', responsible: 'Сидоров Сергей Сергеевич', priority: 'Критический', status: 'Открыто', fixDeadline: '2026-05-16', executorComment: '' },
  { id: 4, projectId: 3, stageId: 15, documentId: 4, text: 'Добавить ссылку на ведомость отделки.', author: 'Кузнецова Анна Андреевна', responsible: 'Сидоров Сергей Сергеевич', priority: 'Низкий', status: 'На повторной проверке', fixDeadline: '2026-05-20', executorComment: 'Ссылка добавлена' },
  { id: 5, projectId: 3, stageId: 15, documentId: 4, text: 'Загрузить актуальную версию пояснительной записки.', author: 'Кузнецова Анна Андреевна', responsible: 'Сидоров Сергей Сергеевич', priority: 'Высокий', status: 'Закрыто', fixDeadline: '2026-05-14', executorComment: 'Последняя версия загружена' },
];

export const notifications = [
  { id: 1, userEmail: 'architect@max-arh.local', message: 'Вам назначен этап "Проектная документация".', objectLink: '/projects/1/stages/3', read: false, createdAt: '2026-05-12T08:00:00' },
  { id: 2, userEmail: 'reviewer@max-arh.local', message: 'Документ "План 1 этажа" отправлен на проверку.', objectLink: '/projects/1/documents/2', read: false, createdAt: '2026-05-12T08:15:00' },
  { id: 3, userEmail: 'architect@max-arh.local', message: 'Вам назначено замечание с высоким приоритетом.', objectLink: '/remarks/1', read: false, createdAt: '2026-05-12T08:20:00' },
  { id: 4, userEmail: 'architect@max-arh.local', message: 'Замечание по документу "Фасад главный" закрыто.', objectLink: '/remarks/5', read: true, createdAt: '2026-05-11T18:00:00' },
  { id: 5, userEmail: 'manager@max-arh.local', message: 'Этап "Рабочая документация" просрочен.', objectLink: '/projects/3/stages/4', read: false, createdAt: '2026-05-12T08:35:00' },
];

export const auditLog = [
  { id: 1, user: 'Петров Петр Петрович', action: 'Создан проект', objectName: 'Многоэтажный жилой дом', description: 'Руководитель проекта создал новый проект', createdAt: '2026-05-01T09:30:00' },
  { id: 2, user: 'Сидоров Сергей Сергеевич', action: 'Загружен документ', objectName: 'План 1 этажа', description: 'Исполнитель загрузил исходную версию документа', createdAt: '2026-05-10T11:00:00' },
  { id: 3, user: 'Кузнецова Анна Андреевна', action: 'Создано замечание', objectName: 'План 1 этажа', description: 'Проверяющий создал замечание по плану', createdAt: '2026-05-10T12:10:00' },
  { id: 4, user: 'Сидоров Сергей Сергеевич', action: 'Загружена новая версия документа', objectName: 'План 1 этажа', description: 'Исполнитель устранил замечания и загрузил v2', createdAt: '2026-05-12T15:10:00' },
  { id: 5, user: 'Кузнецова Анна Андреевна', action: 'Замечание закрыто', objectName: 'План 1 этажа', description: 'Проверяющий закрыл замечание после исправления', createdAt: '2026-05-12T18:05:00' },
];

export const documentReviewQueue = [
  { id: 1, name: 'План 1 этажа', projectName: 'Многоэтажный жилой дом', stageName: 'Проектная документация', documentType: 'Пояснительная записка', version: 2, uploadedBy: 'Сидоров Сергей Сергеевич', sentAt: '2026-05-12T15:10:00', status: 'На проверке', remarksCount: 2 },
  { id: 2, name: 'Фасад главный', projectName: 'Административное здание', stageName: 'Эскизный проект', documentType: 'Фасад', version: 1, uploadedBy: 'Сидоров Сергей Сергеевич', sentAt: '2026-05-11T14:20:00', status: 'На проверке', remarksCount: 1 },
  { id: 3, name: 'Архитектурные решения', projectName: 'Реконструкция общественного здания', stageName: 'Проектная документация', documentType: 'Архитектурные решения', version: 3, uploadedBy: 'Сидоров Сергей Сергеевич', sentAt: '2026-05-11T09:10:00', status: 'На повторной проверке', remarksCount: 2 },
];

export const taskBoard = {
  EXECUTOR: [
    { id: 1, type: 'Этап', project: 'Многоэтажный жилой дом', stage: 'Проектная документация', document: '', description: 'Продолжить выпуск раздела ПД', priority: 'Высокий', deadline: '2026-06-20', status: 'В работе' },
    { id: 2, type: 'Замечание', project: 'Многоэтажный жилой дом', stage: 'Проектная документация', document: 'План 1 этажа', description: 'Уточнить размеры эвакуационного выхода', priority: 'Высокий', deadline: '2026-05-18', status: 'В работе' },
    { id: 3, type: 'Документ', project: 'Административное здание', stage: 'Эскизный проект', document: 'Фасад главный', description: 'Загрузить обновленную версию', priority: 'Средний', deadline: '2026-05-20', status: 'Ожидает' },
  ],
  REVIEWER: [
    { id: 1, type: 'Документ на проверке', project: 'Многоэтажный жилой дом', stage: 'Проектная документация', document: 'План 1 этажа', description: 'Проверить обновленную версию', priority: 'Высокий', deadline: '2026-05-12', status: 'В работе' },
    { id: 2, type: 'Замечание на повторной проверке', project: 'Реконструкция общественного здания', stage: 'Проектная документация', document: 'Архитектурные решения', description: 'Повторно проверить исправления', priority: 'Средний', deadline: '2026-05-13', status: 'Ожидает' },
    { id: 3, type: 'Этап к принятию', project: 'Административное здание', stage: 'Эскизный проект', document: '', description: 'Принять этап после проверки документов', priority: 'Средний', deadline: '2026-05-20', status: 'Ожидает' },
  ],
  PROJECT_MANAGER: [
    { id: 1, type: 'Просроченный проект', project: 'Реконструкция общественного здания', stage: 'Рабочая документация', document: '', description: 'Проект требует вмешательства', priority: 'Критический', deadline: '2026-05-10', status: 'Просрочен' },
    { id: 2, type: 'Риск просрочки этапа', project: 'Многоэтажный жилой дом', stage: 'Проектная документация', document: '', description: 'Нужно ускорить согласования', priority: 'Высокий', deadline: '2026-06-20', status: 'В работе' },
    { id: 3, type: 'Критическое замечание', project: 'Административное здание', stage: 'Эскизный проект', document: 'Фасад главный', description: 'Требуется решение от проверяющего', priority: 'Критический', deadline: '2026-05-16', status: 'Открыто' },
  ],
};

export const objectTypes = ['Жилое здание', 'Общественное здание', 'Административное здание', 'Промышленное здание', 'Реконструкция', 'Иное'];
export const projectStatuses = ['Создан', 'В работе', 'На проверке', 'Есть замечания', 'Просрочен', 'Завершен', 'Архивирован'];
export const stageStatuses = ['Не начат', 'В работе', 'На проверке', 'Есть замечания', 'Исправляется', 'Принят', 'Просрочен'];
export const documentStatuses = ['Черновик', 'На проверке', 'Есть замечания', 'Исправляется', 'Принят', 'Отклонен'];
export const remarkPriorities = ['Низкий', 'Средний', 'Высокий', 'Критический'];
export const remarkStatuses = ['Открыто', 'В работе', 'Исправлено', 'На повторной проверке', 'Закрыто', 'Отклонено'];

export const roleLabels = {
  ADMIN: 'Администратор',
  PROJECT_MANAGER: 'Руководитель проекта',
  EXECUTOR: 'Исполнитель',
  REVIEWER: 'Проверяющий',
};

export const roleMenu = {
  ADMIN: ['dashboard', 'projects', 'tasks', 'review', 'remarks', 'notifications', 'users', 'audit'],
  PROJECT_MANAGER: ['dashboard', 'projects', 'tasks', 'review', 'remarks', 'notifications', 'audit'],
  EXECUTOR: ['dashboard', 'projects', 'tasks', 'remarks', 'notifications'],
  REVIEWER: ['dashboard', 'projects', 'tasks', 'review', 'remarks', 'notifications'],
};

export const menuLabels = {
  dashboard: 'Дашборд',
  projects: 'Проекты',
  tasks: 'Мои задачи',
  review: 'Документы на проверке',
  remarks: 'Замечания',
  notifications: 'Уведомления',
  users: 'Пользователи',
  audit: 'Журнал действий',
};

export const statusTone = {
  'Принят': 'success',
  'Завершен': 'success',
  'Закрыто': 'success',
  'На проверке': 'info',
  'В работе': 'warning',
  'Исправляется': 'warning',
  'Открыто': 'error',
  'Есть замечания': 'error',
  'Просрочен': 'error',
  'Критический': 'error',
  'Не начат': 'neutral',
  'Архивирован': 'neutral',
  'Черновик': 'neutral',
  'Отклонен': 'error',
  'Исправлено': 'success',
  'На повторной проверке': 'info',
  'Активен': 'success',
  'Неактивен': 'neutral',
};

export function formatDate(value) {
  if (!value) return '—';
  return new Intl.DateTimeFormat('ru-RU').format(new Date(value));
}

export function formatDateTime(value) {
  if (!value) return '—';
  return new Intl.DateTimeFormat('ru-RU', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(value));
}

export function daysLeft(deadline) {
  const today = new Date('2026-05-11T00:00:00');
  const target = new Date(`${deadline}T00:00:00`);
  return Math.round((target - today) / (1000 * 60 * 60 * 24));
}

export function getProjectById(id) {
  return projects.find((project) => project.id === id);
}

export function getStagesByProject(projectId) {
  return stages.filter((stage) => stage.projectId === projectId).sort((a, b) => a.sortOrder - b.sortOrder);
}

export function getDocumentsByProject(projectId) {
  return documents.filter((document) => document.projectId === projectId);
}

export function getRemarksByProject(projectId) {
  return remarks.filter((remark) => remark.projectId === projectId);
}

export function getProjectMembers(projectId) {
  return projectMembers.filter((member) => member.projectId === projectId);
}

export function getDocumentsByStage(stageId) {
  return documents.filter((document) => document.stageId === stageId);
}

export function getRemarksByStage(stageId) {
  return remarks.filter((remark) => remark.stageId === stageId);
}

export function getRemarksByDocument(documentId) {
  return remarks.filter((remark) => remark.documentId === documentId);
}

export function getVersionsByDocument(documentId) {
  return versions.filter((version) => version.documentId === documentId).sort((a, b) => a.version - b.version);
}

export function getDocumentById(id) {
  return documents.find((document) => document.id === id);
}

export function getStageById(id) {
  return stages.find((stage) => stage.id === id);
}

export function getRemarkById(id) {
  return remarks.find((remark) => remark.id === id);
}

export function getTasksForRole(role) {
  return taskBoard[role] ?? [];
}

export function filterProjectsForRole(role, userEmail) {
  if (role === 'ADMIN') {
    return projects;
  }

  if (role === 'PROJECT_MANAGER') {
    return projects.filter((project) => project.managerId === 2);
  }

  if (role === 'EXECUTOR') {
    return projects.filter((project) => [1, 2, 3].includes(project.id));
  }

  return projects.filter((project) => getDocumentsByProject(project.id).some((document) => document.status === 'На проверке' || document.status === 'На повторной проверке'));
}

export function filterNotificationsForUser(email) {
  return notifications.filter((notification) => notification.userEmail === email);
}

export function filterDocumentsForReview(role) {
  if (role === 'ADMIN' || role === 'PROJECT_MANAGER' || role === 'REVIEWER') {
    return documentReviewQueue;
  }
  return [];
}

export function countRemarksByStatus(status) {
  return remarks.filter((remark) => remark.status === status).length;
}

export function countProjectsByStatus(status) {
  return projects.filter((project) => project.status === status).length;
}
