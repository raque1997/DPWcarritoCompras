document.addEventListener("DOMContentLoaded", function () {
    const menuContainer = document.getElementById('menu-container');

    if (menuContainer) {
        fetch('menu.html')
            .then(response => response.text())
            .then(data => {
                menuContainer.innerHTML = data;
            })
            .catch(error => console.error('Error al cargar el menú:', error));
    }
});
