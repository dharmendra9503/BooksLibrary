// DOM Elements
const body = document.body;
const themeSwitch = document.getElementById('theme-switch');
const gridViewBtn = document.getElementById('grid-view');
const listViewBtn = document.getElementById('list-view');
const booksContainer = document.querySelector('.books-container');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const sortSelect = document.getElementById('sort-select');
const loadMoreBtn = document.getElementById('load-more');

// API Configuration
const API_URL = 'https://api.freeapi.app/api/v1/public/books';
let currentPage = 1;
let totalPages = 1;
let booksData = [];
let searchTerm = '';

//Theme handling
function initTheme() {
    // Check for saved theme preference or use the system preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
        body.classList.remove('light-mode');
    } else if (savedTheme === 'light') {
        body.classList.remove('dark-mode');
        body.classList.add('light-mode');
    } else {
        // If no saved preference, check system preference
        const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
        if (prefersDarkScheme.matches) {
            body.classList.add('dark-mode');
            body.classList.remove('light-mode');
            localStorage.setItem('theme', 'dark');
        } else {
            body.classList.add('light-mode');
            localStorage.setItem('theme', 'light');
        }
    }
}

// Toggle theme function
function toggleTheme() {
    if (document.body.classList.contains('dark-mode')) {
        // Switch to light theme
        body.classList.remove('dark-mode');
        body.classList.add('light-mode');
        localStorage.setItem('mode', 'light');
    } else {
        // Switch to dark theme
        body.classList.add('dark-mode');
        body.classList.remove('light-mode');
        localStorage.setItem('theme', 'dark');
    }
}

// View Toggle Functionality
gridViewBtn.addEventListener('click', () => {
    booksContainer.className = 'books-container grid-view';
    gridViewBtn.classList.add('active');
    listViewBtn.classList.remove('active');
    localStorage.setItem('view', 'grid');
});

listViewBtn.addEventListener('click', () => {
    booksContainer.className = 'books-container list-view';
    listViewBtn.classList.add('active');
    gridViewBtn.classList.remove('active');
    localStorage.setItem('view', 'list');
});

// Check for saved view preference
const savedView = localStorage.getItem('view');
if (savedView) {
    if (savedView === 'list') {
        booksContainer.className = 'books-container list-view';
        listViewBtn.classList.add('active');
        gridViewBtn.classList.remove('active');
    } else {
        booksContainer.className = 'books-container grid-view';
        gridViewBtn.classList.add('active');
        listViewBtn.classList.remove('active');
    }
}

// Helper functions
function showLoader() {
    // Create loader if it doesn't exist
    if (!document.querySelector('.loader')) {
        const loader = document.createElement('div');
        loader.className = 'loader';
        loader.innerHTML = `
            <div class="spinner"></div>
            <p>Loading books...</p>
        `;
        document.querySelector('main').appendChild(loader);
    } else {
        document.querySelector('.loader').style.display = 'flex';
    }

    loadMoreBtn.disabled = true;
}

function hideLoader() {
    const loader = document.querySelector('.loader');
    if (loader) {
        loader.style.display = 'none';
    }

    loadMoreBtn.disabled = false;
}

function showError(message) {
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;

    document.querySelector('main').appendChild(errorElement);

    // Auto-remove after 5 seconds
    setTimeout(() => {
        errorElement.remove();
    }, 5000);
}


// API Functions
async function fetchBooks(page = 1) {
    try {
        showLoader();

        const response = await fetch(`${API_URL}?page=${page}&query=${searchTerm}`);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        if (data.success && data.data) {
            hideLoader();

            totalPages = data.data.totalPages || 1;

            // Handle pagination button visibility
            if (!data.data.nextPage) {
                loadMoreBtn.parentElement.classList.add('unvisible');
            }

            booksData = [...booksData, ...data.data.data];
            renderBooks(data.data.data);
            return data.data.data;
        } else {
            throw new Error('No data received from API');
        }
    } catch (error) {
        hideLoader();
        showError(`Failed to fetch books: ${error.message}`);
        return [];
    }
}

// Render books to the DOM
function renderBooks(books) {
    // Clear existing books if it's a fresh render
    if (currentPage === 1) {
        booksContainer.innerHTML = '';
    }

    // If no books found
    if (books.length === 0) {
        booksContainer.innerHTML = `
            <div class="no-results">
                <i class="fas fa-book-open fa-3x"></i>
                <h2>No books found</h2>
                <p>Try adjusting your search or filters</p>
            </div>
        `;
        return;
    }

    // Create book elements
    books.forEach(book => {
        const bookElement = createBookElement(book);
        booksContainer.appendChild(bookElement);
    });

    // Add animation to new elements
    const bookItems = document.querySelectorAll('.book-item');
    bookItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.05}s`;
    });
}

// Create a single book element
function createBookElement(book) {
    const bookItem = document.createElement('div');
    bookItem.className = 'book-item fade-in';

    // Use placeholder image if thumbnail not available
    const thumbnailSrc = book.volumeInfo?.imageLinks?.thumbnail || 'https://via.placeholder.com/128x192?text=No+Cover';

    // Format date if available
    const publishedDate = book.volumeInfo?.publishedDate
        ? new Date(book.volumeInfo.publishedDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
        : 'Unknown';

    bookItem.innerHTML = `
        <div class="book-image">
            <img src="${thumbnailSrc}" alt="${book.volumeInfo?.title || 'Book cover'}">
        </div>
        <div class="book-info">
            <h3 class="book-title">${book.volumeInfo?.title || 'Unknown Title'}</h3>
            <p class="book-author">By ${book.volumeInfo?.authors?.join(', ') || 'Unknown Author'}</p>
            <p class="book-publisher">${book.volumeInfo?.publisher || 'Unknown Publisher'}</p>
            <p class="book-date">Published: ${publishedDate}</p>
            <div class="book-link-container">
                <a href="${book.volumeInfo?.infoLink || '#'}" class="book-link" target="_blank">Read More</a>
            </div>
        </div>
    `;

    // Add hover effect with book info preview
    bookItem.addEventListener('mouseenter', () => {
        bookItem.classList.add('hover');
    });

    bookItem.addEventListener('mouseleave', () => {
        bookItem.classList.remove('hover');
    });

    return bookItem;
}

// Search functionality
function handleSearch() {
    searchTerm = searchInput.value.trim().toLowerCase();
    fetchBooks();
}

// Search event listeners
searchBtn.addEventListener('click', handleSearch);
searchInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        handleSearch();
    }

    // If search field is cleared, reset results
    if (searchInput.value === '') {
        handleSearch();
    }
});

// Sorting functionality
function handleSort(sortOption, books = booksData) {
    let sortedBooks = [...books];

    switch (sortOption) {
        case 'title':
            // Sort by title A-Z
            sortedBooks.sort((a, b) =>
                (a.volumeInfo?.title || '').localeCompare(b.volumeInfo?.title || '')
            );
            break;

        case 'title-desc':
            // Sort by title Z-A
            sortedBooks.sort((a, b) =>
                (b.volumeInfo?.title || '').localeCompare(a.volumeInfo?.title || '')
            );
            break;

        case 'date':
            // Sort by date (newest first)
            sortedBooks.sort((a, b) => {
                const dateA = a.volumeInfo?.publishedDate ? new Date(a.volumeInfo.publishedDate) : new Date(0);
                const dateB = b.volumeInfo?.publishedDate ? new Date(b.volumeInfo.publishedDate) : new Date(0);
                return dateB - dateA;
            });
            break;

        case 'date-desc':
            // Sort by date (oldest first)
            sortedBooks.sort((a, b) => {
                const dateA = a.volumeInfo?.publishedDate ? new Date(a.volumeInfo.publishedDate) : new Date(0);
                const dateB = b.volumeInfo?.publishedDate ? new Date(b.volumeInfo.publishedDate) : new Date(0);
                return dateA - dateB;
            });
            break;

        default:
            // No sorting
            break;
    }
    booksContainer.innerHTML = '';
    renderBooks(sortedBooks);
}

// Sort event listener
sortSelect.addEventListener('change', () => {
    handleSort(sortSelect.value);
});

// Load more books
loadMoreBtn.addEventListener('click', () => {
    currentPage++;
    fetchBooks(currentPage);
});

// Initialize the application
function initApp() {
    // Start by fetching books
    fetchBooks();

    // Implement scroll-based pagination
    // window.addEventListener('scroll', () => {
    //     // Check if we're near the bottom of the page
    //     if (window.innerHeight + window.scrollY >= body.offsetHeight - 500) {
    //         // Only load more if we haven't reached the last page and aren't currently loading
    //         if (currentPage < totalPages && !document.querySelector('.loader')?.style.display === 'flex') {
    //             currentPage++;
    //             fetchBooks(currentPage);
    //         }
    //     }
    // });
}

// Theme toggle event listener
themeSwitch.addEventListener('click', toggleTheme);

// Start the app when DOM is fully loaded
document.addEventListener('DOMContentLoaded', initApp);

initTheme();