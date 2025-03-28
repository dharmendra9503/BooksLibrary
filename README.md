# Books Library

A modern, responsive web application for exploring and discovering books using the FreeAPI.app API. This application allows users to browse, search, and sort through a vast collection of books in a visually appealing interface.

## Features

- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Dark/Light Mode**: Toggle between color schemes based on your preference
- **View Options**: Switch between grid and list views
- **Search Functionality**: Filter books by title or author
- **Sorting Options**: Sort books alphabetically or by publication date
- **Pagination**: Load more books as you scroll or click the "Load More" button
- **Detailed Information**: View comprehensive book details including title, author, publisher, and publication date
- **External Links**: Access additional book information via external links

## Technology Stack

- **HTML5**: For structuring the content
- **CSS3**: For styling with modern techniques including CSS variables, Flexbox, and Grid
- **JavaScript**: For interactive features and API integration
- **Local Storage**: For persisting user preferences

## Getting Started

1. Clone this repository:
   ```
   git clone https://github.com/dharmendra9503/BooksLibrary.git
   ```

2. Navigate to the project directory:
   ```
   cd BooksLibrary
   ```

3. Open the `index.html` file in your browser or use a local development server:
   ```
   # If you have Python installed
   python -m http.server
   
   # If you have Node.js installed
   npx serve
   ```

4. Start exploring the Books Library!

## Project Structure

```
books-library/
├── index.html         # Main HTML file with the structure
├── styles.css         # CSS for styling the application
├── script.js          # JavaScript for application functionality
└── README.md          # Project documentation
```

## Customization

### Changing Colors

The color scheme is defined using CSS variables in the `:root` selector in `styles.css`. You can easily modify these variables to change the color scheme:

```css
:root {
    --primary-color: #4361ee;
    --secondary-color: #3a0ca3;
    /* other color variables */
}
```

### Adding Features

The JavaScript file includes placeholders for expanding functionality. Each section is well-commented to help you understand where to add your code.

## Future Enhancements

- User authentication and personalized book recommendations
- Book reviews and ratings
- Reading lists and favorites functionality
- Advanced filtering options
- Integration with additional book APIs

## Acknowledgments

- [FreeAPI.app](https://freeapi.app) for providing the books API
- [Font Awesome](https://fontawesome.com) for the icons
- [Google Fonts](https://fonts.google.com) for the typography 