document.addEventListener('DOMContentLoaded', () => {
    const sidebarButton = document.getElementById('sidebar-button') as HTMLButtonElement;
    const closeSidebarButton = document.getElementById('close-sidebar-button') as HTMLButtonElement;
    const sidebar = document.getElementById('sidebar') as HTMLDivElement;
  
    sidebarButton.addEventListener('click', () => {
      sidebar.classList.add('show');
      sidebar.classList.remove('hidden');
    });
  
    closeSidebarButton.addEventListener('click', () => {
      sidebar.classList.remove('show');
      sidebar.classList.add('hidden');
    });
  
    document.addEventListener('click', (event) => {
      if (!sidebar.contains(event.target as Node) && !sidebarButton.contains(event.target as Node)) {
        sidebar.classList.remove('show');
        sidebar.classList.add('hidden');
      }
    });
  });