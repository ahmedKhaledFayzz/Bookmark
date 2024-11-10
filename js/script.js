document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('bookmarkForm');
    const bookmarksList = document.getElementById('bookmarksList');
    const searchInput = document.getElementById('searchBookmark');
    let bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];

    // Show toast notification
    function showToast(message, type = 'success') {
        const toastContainer = document.querySelector('.toast-container');
        const toast = document.createElement('div');
        toast.className = `toast align-items-center text-white bg-${type} border-0`;
        toast.setAttribute('role', 'alert');
        toast.setAttribute('aria-live', 'assertive');
        toast.setAttribute('aria-atomic', 'true');

        toast.innerHTML = `
            <div class="d-flex">
                <div class="toast-body">
                    ${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" 
                    data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
        `;

        toastContainer.appendChild(toast);
        const bsToast = new bootstrap.Toast(toast);
        bsToast.show();

        toast.addEventListener('hidden.bs.toast', () => {
            toast.remove();
        });
    }

    // Get category badge color
    function getCategoryColor(category) {
        const colors = {
            'Work': 'primary',
            'Personal': 'success',
            'Education': 'info',
            'Entertainment': 'warning',
            'Other': 'secondary'
        };
        return colors[category] || 'secondary';
    }

    // Display bookmarks
    function displayBookmarks(bookmarksToShow = bookmarks) {
        bookmarksList.innerHTML = '';
        
        if (bookmarksToShow.length === 0) {
            bookmarksList.innerHTML = `
                <tr>
                    <td colspan="4" class="table-empty">
                        <i class="fas fa-bookmark mb-3" style="font-size: 2rem;"></i>
                        <p class="mb-0">No bookmarks found</p>
                    </td>
                </tr>
            `;
            return;
        }

        bookmarksToShow.forEach((bookmark, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${bookmark.name}</td>
                <td>
                    <span class="category-badge bg-${getCategoryColor(bookmark.category)}">
                        ${bookmark.category}
                    </span>
                </td>
                <td>
                    <div class="d-flex gap-2">
                        <a href="${bookmark.url}" target="_blank" 
                            class="btn btn-visit btn-sm">
                            <i class="fas fa-external-link-alt me-1"></i> Visit
                        </a>
                        <button class="btn btn-delete btn-sm" 
                            onclick="deleteBookmark(${index})">
                            <i class="fas fa-trash-alt me-1"></i> Delete
                        </button>
                    </div>
                </td>
            `;
            bookmarksList.appendChild(row);
        });
    }

    // Add new bookmark
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const siteName = document.getElementById('siteName').value;
        const siteUrl = document.getElementById('siteUrl').value;
        const category = document.getElementById('category').value;

        // Add http:// if not present
        let url = siteUrl;
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            url = 'https://' + url;
        }

        // Add bookmark to array
        bookmarks.push({
            name: siteName,
            url: url,
            category: category,
            date: new Date().toISOString()
        });

        // Save to localStorage
        localStorage.setItem('bookmarks', JSON.stringify(bookmarks));

        // Show success message
        showToast('Bookmark added successfully!');

        // Clear form
        form.reset();

        // Refresh display
        displayBookmarks();
    });

    // Delete bookmark
    window.deleteBookmark = function(index) {
        if (confirm('Are you sure you want to delete this bookmark?')) {
            bookmarks.splice(index, 1);
            localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
            showToast('Bookmark deleted successfully!', 'danger');
            displayBookmarks();
        }
    }

    // Search functionality
    searchInput.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        const filteredBookmarks = bookmarks.filter(bookmark => 
            bookmark.name.toLowerCase().includes(searchTerm) ||
            bookmark.category.toLowerCase().includes(searchTerm)
        );
        displayBookmarks(filteredBookmarks);
    });

    // Initial display
    displayBookmarks();
});