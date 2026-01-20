<script>
  import { goto } from '$app/navigation';

  let email = $state(""); // Usando Runes de Svelte 5
  let password = $state("");

  function handleLogin(e) {
    e.preventDefault();
    // Simulación de login: redirige a la página de alertas
    goto('/alerts');
  }
</script>

<div class="flex min-h-screen items-center justify-center p-4 md:p-8 bg-background-light dark:bg-background-dark">
  <div class="flex w-full max-w-6xl overflow-hidden rounded-xl shadow-lg bg-white dark:bg-background-dark/50">
    
    <div class="hidden lg:flex lg:w-1/2 flex-col items-center justify-center bg-[#e7f3eb] dark:bg-background-dark/60 p-12 text-center">
      <div class="flex flex-col gap-6">
        <div class="flex justify-center items-center gap-3">
          <span class="material-symbols-outlined text-4xl text-primary">health_and_safety</span>
          <h1 class="text-2xl font-bold text-[#0d1b12] dark:text-white">VitalCare</h1>
        </div>
        <div class="text-left">
          <h2 class="text-[#0d1b12] dark:text-white text-4xl font-black leading-tight">Monitoring Health, Ensuring Peace of Mind</h2>
          <p class="text-[#4c9a66] mt-2">Your trusted partner in continuous patient monitoring.</p>
        </div>
        <div class="w-full aspect-video bg-cover rounded-lg mt-4" style="background-image: url('https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=1000');"></div>
      </div>
    </div>

    <div class="w-full lg:w-1/2 p-8 md:p-16 flex flex-col justify-center">
      <form onsubmit={handleLogin} class="flex flex-col gap-6 max-w-md mx-auto w-full">
        <div>
          <h3 class="text-3xl font-bold text-[#0d1b12] dark:text-white">Secure Login</h3>
          <p class="text-[#4c9a66]">Please enter your details to access your dashboard.</p>
        </div>

        <div class="flex flex-col gap-4">
          <div class="flex flex-col gap-2">
            <label class="text-sm font-medium" for="email">Email Address</label>
            <input bind:value={email} type="email" id="email" class="h-12 px-4 rounded-lg border border-[#cfe7d7] dark:bg-background-dark dark:border-gray-700" placeholder="doctor@vitalcare.com" required />
          </div>
          <div class="flex flex-col gap-2">
            <label class="text-sm font-medium" for="password">Password</label>
            <input bind:value={password} type="password" id="password" class="h-12 px-4 rounded-lg border border-[#cfe7d7] dark:bg-background-dark dark:border-gray-700" placeholder="••••••••" required />
          </div>
        </div>

        <button type="submit" class="h-12 bg-primary text-[#102216] font-bold rounded-lg hover:bg-opacity-90 transition-all">
          Log In
        </button>
      </form>
    </div>
  </div>
</div>