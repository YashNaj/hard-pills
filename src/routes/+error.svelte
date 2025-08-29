<script lang='ts'>
  import { page } from '$app/state'
  import  logo  from '$lib/assets/hard_pills.png'
</script>
<main class = 'w-screen font-inter h-[100dvh] max-h-screen flex flex-col'>
  <div class = 'logo-container w-full flex justify-center'>
    <div class = 'logo-wrapper w-40'>
   <img src={logo} class = 'max-w-full object-cover' alt='logo'/> 
    </div>
  </div>
      <div class = 'w-full h-full flex-grow grid place-items-center'>
    <div class ='error-code-container '>
      <h1 class = 'font-bold text-6xl'>
        {page.status}
      </h1>
      <h2 class = 'text-md text-center'>
        {page?.error.message}
      </h2>
    </div>

  </div> 
    
    <div class = 'bg-black w-full h-20'>
        
  </div>
</main>
