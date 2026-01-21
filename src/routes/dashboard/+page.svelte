<script>
    import { Activity, Users, FileText, Bell } from "lucide-svelte";
</script>

<div class="dashboard-home">
    <h1 class="page-title">Dashboard Overview</h1>

    <div class="stats-grid">
        <div class="stat-card">
            <div class="stat-icon bg-green">
                <Users size={24} color="#10b981" />
            </div>
            <div class="stat-info">
                <div class="stat-label">Total Patients</div>
                <div class="stat-value">1,234</div>
            </div>
        </div>

        <div class="stat-card">
            <div class="stat-icon bg-orange">
                <Activity size={24} color="#f59e0b" />
            </div>
            <div class="stat-info">
                <div class="stat-label">Critical Alerts</div>
                <div class="stat-value">5</div>
            </div>
        </div>

        <div class="stat-card">
            <div class="stat-icon bg-blue">
                <FileText size={24} color="#3b82f6" />
            </div>
            <div class="stat-info">
                <div class="stat-label">Reports Generated</div>
                <div class="stat-value">48</div>
            </div>
        </div>
    </div>

    <div class="welcome-section">
        <h2>Welcome back, Dr. Evelyn Reed</h2>
        <p>Here's what's happening in your ward today.</p>
    </div>
</div>

<style>
    .dashboard-home {
        padding: var(--spacing-2xl);
    }

    .page-title {
        font-size: 2rem;
        font-weight: 700;
        margin-bottom: var(--spacing-xl);
    }

    .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
        gap: var(--spacing-lg);
        margin-bottom: var(--spacing-2xl);
    }

    .stat-card {
        background-color: white;
        padding: var(--spacing-lg);
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-sm);
        display: flex;
        align-items: center;
        gap: var(--spacing-md);
    }

    .stat-icon {
        width: 48px;
        height: 48px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .bg-green {
        background-color: rgba(16, 185, 129, 0.1);
    }
    .bg-orange {
        background-color: rgba(245, 158, 11, 0.1);
    }
    .bg-blue {
        background-color: rgba(59, 130, 246, 0.1);
    }

    .stat-info {
        display: flex;
        flex-direction: column;
    }

    .stat-label {
        color: var(--text-secondary);
        font-size: 0.875rem;
    }

    .stat-value {
        font-size: 1.5rem;
        font-weight: 700;
        color: var(--gray-900);
    }

    .welcome-section {
        background: linear-gradient(135deg, #10b981, #059669);
        color: white;
        padding: var(--spacing-2xl);
        border-radius: var(--radius-lg);
    }

    .welcome-section h2 {
        font-size: 1.5rem;
        margin-bottom: var(--spacing-sm);
    }

    .welcome-section p {
        opacity: 0.9;
    }
</style>
