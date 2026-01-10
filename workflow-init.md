# BMAD Workflow Initialization Guide

## Available Workflows

### Greenfield (New Projects)

#### 1. `greenfield-fullstack`
**Best for:** Building complete full-stack applications from scratch
- **Project Types:** web-app, saas, enterprise-app, prototype, mvp
- **Workflow:** Analyst → PM → UX Expert → Architect → PO → Development Cycle

#### 2. `greenfield-ui`
**Best for:** Frontend/UI-focused projects
- **Project Types:** spa, mobile-app, micro-frontend, static-site, ui-prototype
- **Workflow:** Analyst → PM → UX Expert → Architect → PO → Development Cycle

#### 3. `greenfield-service`
**Best for:** Backend services and APIs
- **Project Types:** rest-api, graphql-api, microservice, backend-service, api-prototype
- **Workflow:** Analyst → PM → Architect → PO → Development Cycle

### Brownfield (Existing Projects)

#### 4. `brownfield-fullstack`
**Best for:** Enhancing existing full-stack applications

#### 5. `brownfield-ui`
**Best for:** Enhancing existing frontend applications

#### 6. `brownfield-service`
**Best for:** Enhancing existing backend services

## How to Start a Workflow

### Option 1: Using BMAD Orchestrator (Web UI)
If you're using BMAD in a web UI (Claude, Gemini, Custom GPT):
```
/workflow-start {workflow-id}
```

Example:
```
/workflow-start greenfield-fullstack
```

### Option 2: Using IDE Agents
In your IDE, start with the first agent in the workflow sequence:

**For greenfield-fullstack:**
```
@analyst Create a project brief for [your project idea]
```

**For greenfield-ui:**
```
@analyst Create a project brief for [your UI project idea]
```

**For greenfield-service:**
```
@analyst Create a project brief for [your service/API idea]
```

## Workflow Commands

Once a workflow is active:
- `/workflow-status` - Check current progress
- `/workflow-next` - See next recommended step
- `/workflow-resume` - Resume from last position
- `/workflows` - List all available workflows

## Quick Start Checklist

1. **Choose your workflow** based on project type
2. **Start with Analyst agent** to create project brief
3. **Follow the sequence** as outlined in the workflow
4. **Save artifacts** to `docs/` folder as you progress
5. **Switch to IDE** after planning phase for development

## Next Steps

After choosing a workflow, the first step is typically:
1. **Analyst** creates `project-brief.md`
2. Save it to `docs/project-brief.md`
3. Continue to next agent in sequence

---

**Need help?** Review `.bmad-core/user-guide.md` for detailed workflow documentation.
