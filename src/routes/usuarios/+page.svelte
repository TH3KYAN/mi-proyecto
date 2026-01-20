<script>
	// Lista de usuarios dinámica usando Svelte 5 Runes
	let usuarios = $state([
		{ id: 1, name: 'Dr. Alex Chen', email: 'alex.chen@healthsys.io', role: 'Clinician', status: 'Active', statusColor: 'bg-green-500', img: '3' },
		{ id: 2, name: 'Dr. Maria Garcia', email: 'maria.garcia@healthsys.io', role: 'Administrator', status: 'Active', statusColor: 'bg-green-500', img: '4' },
		{ id: 3, name: 'Kenji Tanaka', email: 'kenji.tanaka@healthsys.io', role: 'Viewer', status: 'Invited', statusColor: 'bg-yellow-500', img: '5' },
		{ id: 4, name: 'Sarah Johnson', email: 'sarah.j@healthsys.io', role: 'Clinician', status: 'Deactivated', statusColor: 'bg-red-500', img: '6' }
	]);

	let searchQuery = $state("");

	// Filtrar usuarios en tiempo real según la búsqueda
	let filteredUsers = $derived(
		usuarios.filter(u => 
			u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
			u.email.toLowerCase().includes(searchQuery.toLowerCase())
		)
	);
</script>

<div class="max-w-4xl mx-auto p-6 sm:p-8 lg:p-10">
	<div class="flex flex-wrap justify-between gap-3 pb-4 border-b border-border-light dark:border-border-dark">
		<h1 class="text-text-light dark:text-text-dark text-4xl font-black tracking-tight">Manejador de usuarios</h1>
	</div>
	
	

	<div class="mt-6 flex flex-col md:flex-row gap-4 justify-between items-center">
		<div class="w-full md:w-2/3">
			<div class="flex h-12 w-full items-stretch rounded-lg overflow-hidden border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark focus-within:ring-2 focus-within:ring-primary/50">
				<div class="flex items-center justify-center pl-4 text-subtle-light dark:text-subtle-dark">
					<span class="material-symbols-outlined">search</span>
				</div>
				<input 
					bind:value={searchQuery}
					class="w-full bg-transparent px-4 outline-none text-text-light dark:text-text-dark placeholder:text-subtle-light" 
					placeholder="Buscar por nombre o correo electrónico..." 
					type="text"
				/>
			</div>
		</div>
		
		<div class="w-full md:w-auto flex justify-end gap-2">
			<button class="p-2.5 rounded-lg border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark hover:bg-primary/10">
				<span class="material-symbols-outlined">filter_list</span>
			</button>
			<button class="flex items-center justify-center rounded-lg h-12 bg-primary text-text-light gap-2 px-4 font-bold text-sm">
				<span class="material-symbols-outlined">add</span>
				<span>Agregar nuevo usuario</span>
			</button>
		</div>
	</div>

	<div class="mt-8 bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark overflow-hidden shadow-sm">
		<div class="overflow-x-auto">
			<table class="w-full text-sm text-left">
				<thead class="bg-background-light dark:bg-background-dark text-xs uppercase text-subtle-light dark:text-subtle-dark">
					<tr>
						<th class="px-6 py-4">Nombre</th>
						<th class="px-6 py-4">Rol</th>
						<th class="px-6 py-4">Estado</th>
						<th class="px-6 py-4 text-right">Accion</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-border-light dark:divide-border-dark">
					{#each filteredUsers as user}
						<tr class="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
							<th class="px-6 py-4 font-medium">
								<div class="flex items-center gap-3">
									<img class="w-10 h-10 rounded-full bg-gray-200" src="https://i.pravatar.cc/150?u={user.img}" alt={user.name}/>
									<div>
										<div class="text-base font-semibold text-text-light dark:text-text-dark">{user.name}</div>
										<div class="font-normal text-subtle-light dark:text-subtle-dark">{user.email}</div>
									</div>
								</div>
							</th>
							<td class="px-6 py-4 text-text-light dark:text-text-dark">{user.role}</td>
							<td class="px-6 py-4">
								<div class="flex items-center text-text-light dark:text-text-dark">
									<div class="h-2.5 w-2.5 rounded-full {user.statusColor} mr-2"></div> 
									{user.status}
								</div>
							</td>
							<td class="px-6 py-4 text-right">
								<button class="font-medium text-primary hover:underline">Edit</button>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
			
			{#if filteredUsers.length === 0}
				<div class="p-10 text-center text-subtle-light">
					No se encontraron usuarios que coincidan con "{searchQuery}"
				</div>
			{/if}
		</div>
	</div>
</div>