export function setupDarkModeForComponents() {
  const darkModeToggle = document.getElementById('darkModeToggle') as HTMLInputElement;
  
  const storedDarkMode = localStorage.getItem('darkMode') === 'true';
  
  if (storedDarkMode) {
    document.body.classList.add('dark-mode');
    if (darkModeToggle) {
      darkModeToggle.checked = true;
    }
  }
  
  if (darkModeToggle) {
    darkModeToggle.addEventListener('change', (e) => {
      const isDarkMode = (e.target as HTMLInputElement).checked;
      
      if (isDarkMode) {
        document.body.classList.add('dark-mode');
      } else {
        document.body.classList.remove('dark-mode');
      }
      
      localStorage.setItem('darkMode', isDarkMode.toString());
      
      document.dispatchEvent(new CustomEvent('darkModeChanged', {
        detail: { isDarkMode }
      }));
    });
  }
}