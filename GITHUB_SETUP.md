# Как создать и опубликовать репозиторий на GitHub

Рекомендуемое имя:

```text
herbalife-kiosk-ai-product-prototype
```

Короткое описание:

```text
AI-assisted click-through prototype and product case: User Journey, KPI framework, SVG screens and an offline Figma plugin created from a Product Manager perspective.
```

## Вариант 1 — GitHub + командная строка

### 1. Создайте пустой репозиторий

1. Откройте <https://github.com/new>.
2. Выберите свой аккаунт в поле Owner.
3. Введите имя `herbalife-kiosk-ai-product-prototype`.
4. Выберите `Public`, если ссылку нужно показывать работодателям.
5. Не включайте создание README, `.gitignore` и license — они уже находятся в пакете.
6. Нажмите `Create repository`.

### 2. Подготовьте локальную папку

Распакуйте GitHub-ready ZIP и откройте Terminal / PowerShell непосредственно в распакованной папке.

### 3. Создайте первый commit

```bash
git init
git add .
git commit -m "feat: add AI-assisted product prototype"
git branch -M main
```

### 4. Подключите GitHub

Замените `YOUR_USERNAME` своим логином:

```bash
git remote add origin https://github.com/YOUR_USERNAME/herbalife-kiosk-ai-product-prototype.git
git push -u origin main
```

Если GitHub запросит авторизацию, используйте GitHub Desktop, GitHub CLI или Personal Access Token вместо пароля аккаунта.

## Вариант 2 — GitHub Desktop

1. Откройте GitHub Desktop.
2. Выберите `File → Add Local Repository` и укажите распакованную папку.
3. Если приложение предложит создать Git-репозиторий, подтвердите.
4. Создайте commit с сообщением `feat: add AI-assisted product prototype`.
5. Нажмите `Publish repository`.
6. Укажите имя `herbalife-kiosk-ai-product-prototype` и снимите `Keep this code private`, если нужна публичная ссылка.

## Настройте About

В правой части страницы репозитория нажмите шестерёнку рядом с About.

Добавьте:

- **Description:** текст из начала этой инструкции;
- **Website:** адрес GitHub Pages после публикации;
- **Topics:**

```text
product-management
ai-prototyping
rapid-prototyping
figma-plugin
user-journey
product-metrics
svg
portfolio-case-study
```

## Включите GitHub Pages

В репозитории откройте:

```text
Settings → Pages → Build and deployment
```

Выберите:

```text
Source: Deploy from a branch
Branch: main
Folder: / (root)
```

После публикации адрес будет выглядеть так:

```text
https://YOUR_USERNAME.github.io/herbalife-kiosk-ai-product-prototype/
```

Добавьте этот адрес в About, резюме и портфолио.

## Проверьте публичную страницу

- README отображает превью экранов и Product Story.
- GitHub Pages открывает кликабельный `index.html`.
- В репозитории нет персональных данных, ключей доступа и внутренних материалов компании.
- Ссылка на Figma добавлена только при наличии публичного доступа к файлу.

## Как обновлять проект

После изменения файлов:

```bash
git status
git add .
git commit -m "docs: update product case"
git push
```

Примеры понятных commit-сообщений:

```text
feat: add onboarding state
docs: clarify AI-assisted workflow
fix: correct prototype transition
design: update product story SVG
```

## Что добавить в резюме

Используйте публичную ссылку на GitHub Pages как основную демонстрацию, а ссылку на репозиторий — как подтверждение структуры, документации и воспроизводимого AI-workflow.

