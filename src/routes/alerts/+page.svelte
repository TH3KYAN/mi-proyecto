<script>
  // Datos reactivos usando Runes de Svelte 5
  let alerts = $state([
    { id: 1, severity: 'Critical', patient: 'John Smith (RM 201A)', details: 'Heart Rate Low - 45 bpm', time: '2:14 PM', color: 'red' },
    { id: 2, severity: 'Critical', patient: 'Maria Garcia (RM 305B)', details: 'SpO2 Low - 88%', time: '2:12 PM', color: 'red' },
    { id: 3, severity: 'High', patient: 'Robert Johnson (RM 203A)', details: 'Blood Pressure High - 160/100 mmHg', time: '2:11 PM', color: 'orange' },
    { id: 4, severity: 'Medium', patient: 'David Wilson (RM 302B)', details: 'Temperature High - 101.5°F', time: '2:05 PM', color: 'yellow' }
  ]);

  function acknowledge(id) {
    alerts = alerts.filter(a => a.id !== id);
  }
</script>

<div class="mx-auto max-w-7xl p-8">
  <div class="mb-8">
    <h1 class="text-gray-900 dark:text-gray-50 text-4xl font-black tracking-tight">Vital Signs Alerts</h1>
    <p class="text-gray-500">Monitoreo en tiempo real de pacientes críticos.</p>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
    <div class="p-6 rounded-xl border border-red-200 bg-red-50 dark:bg-red-900/20">
      <p class="text-red-800 dark:text-red-300 font-medium">Critical</p>
      <p class="text-3xl font-bold text-red-900 dark:text-red-200">2</p>
    </div>
    <div class="p-6 rounded-xl border border-orange-200 bg-orange-50 dark:bg-orange-900/20">
      <p class="text-orange-800 dark:text-orange-300 font-medium">High Priority</p>
      <p class="text-3xl font-bold text-orange-900 dark:text-orange-200">1</p>
    </div>
    <div class="p-6 rounded-xl border border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20">
      <p class="text-yellow-800 dark:text-yellow-300 font-medium">Medium</p>
      <p class="text-3xl font-bold text-yellow-900 dark:text-yellow-200">1</p>
    </div>
  </div>

  <div class="bg-white dark:bg-background-dark border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm">
    <table class="w-full text-left">
      <thead class="bg-gray-50 dark:bg-gray-900/50 text-xs uppercase text-gray-500">
        <tr>
          <th class="px-6 py-4">Severity</th>
          <th class="px-6 py-4">Patient</th>
          <th class="px-6 py-4">Details</th>
          <th class="px-6 py-4">Time</th>
          <th class="px-6 py-4 text-right">Actions</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
        {#each alerts as alert (alert.id)}
          <tr class="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
            <td class="px-6 py-4">
              <span class="px-3 py-1 rounded-full text-xs font-bold 
                {alert.color === 'red' ? 'bg-red-100 text-red-700' : 
                 alert.color === 'orange' ? 'bg-orange-100 text-orange-700' : 'bg-yellow-100 text-yellow-700'}">
                {alert.severity}
              </span>
            </td>
            <td class="px-6 py-4 font-medium">{alert.patient}</td>
            <td class="px-6 py-4 text-gray-500 text-sm">{alert.details}</td>
            <td class="px-6 py-4 text-gray-400 text-sm">{alert.time}</td>
            <td class="px-6 py-4 text-right">
              <button onclick={() => acknowledge(alert.id)} class="text-primary font-bold hover:underline">
                Acknowledge
              </button>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
    {#if alerts.length === 0}
      <div class="p-12 text-center text-gray-500">
        <span class="material-symbols-outlined text-4xl mb-2">check_circle</span>
        <p>No hay alertas pendientes.</p>
      </div>
    {/if}
  </div>
</div>