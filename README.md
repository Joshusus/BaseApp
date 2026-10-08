# Base Webapp

A basic webapp I can copy for various projects 😎

## Features

- 🚀 Server-side rendering
- ⚡️ Hot Module Replacement (HMR)
- 📦 Asset bundling and optimization
- 🔄 Data loading and mutations
- 🔒 TypeScript by default
- 🎉 TailwindCSS for styling
- 📖 [React Router docs](https://reactrouter.com/)

## Getting Started

### Installation

Install the dependencies:

```bash
npm install
```

### Development

Start the development server with HMR:

```bash
npm run dev
```

Your application will be available at `http://localhost:5173`.

## Building for Production

Create a production build:

```bash
npm run build
```

## Deployment

### Docker Deployment

To build and run using Docker:

```bash
docker build -t my-app .

# Run the container
docker run -p 3000:3000 my-app
```

The containerized application can be deployed to any platform that supports Docker, including:

- AWS ECS
- Google Cloud Run
- Azure Container Apps
- Digital Ocean App Platform
- Fly.io
- Railway

### DIY Deployment

If you're familiar with deploying Node applications, the built-in app server is production-ready.

Make sure to deploy the output of `npm run build`

```
├── package.json
├── package-lock.json (or pnpm-lock.yaml, or bun.lockb)
├── build/
│   ├── client/    # Static assets
│   └── server/    # Server-side code
```

## Styling

This template comes with [Tailwind CSS](https://tailwindcss.com/) already configured for a simple default starting experience. You can use whatever CSS framework you prefer.

---

Built with ❤️ using React Router.


---


- Cloudinary Integration for images
- React Parallax for.. well what do you think?
- Tabler Icons 
  https://tabler.io/icons
- i18next translations
- To get colour variations & grades (useful for setting up shade-number variants): https://coolors.co/f4f4f4/about

### Feature List
- A carousel component for viewing images
Make this as homemade as reasonably possible, ideally no external library. 
The carousel is to be used for the Portfolio page, where there are collections of images to go through
Perhaps you go into a carousel layout if you click on an image
- Bring the 3 example images on the homepage in line with the portfolio page
I initially made that section as as proof of concept. It should try and tease the person visiting the website to go onto the portfolio page. Currently it's isolated from the portfolio though - see if we can bring it in line. Perhaps it shows a few photos from the first album in portfolio / something like that
- Maybe make a config file to store the names of all the albums etc. This will make it easy for non-technical people to change the website content, and provides a single source for this. (similar purpose behing I18N translation files)
- Slicken the UI, make it more consistent and more professional
In this vein of thought, try and bring the styling into more of a "config area" and then things reference that. You can see this has already been started by how I have the colours in index.css
- I was WIP in usePortfolio by the looks of it. Is this working or not? Identify purpose and fix. Suspect it was to load an album of images.
Main issue is that cloudinary will start billing / restricting requests on repeat calls, so I'm trying to load images once.
- Can I bring lazy loading into the portfolio page? Lower priority this - not sure how many photos we'll end up having
- Have all of this ready for hosting somewhere. Should be easy to build for production. Look out if we've put any keys / credentials etc. in the codebase and set this up for prod too. Assume it should be kept in a secrets pattern?
- Ability to send an email:
In the top left there is a mail contact option. There's also the "Contact" section, where I wanted to have a textarea for someone to type an email, then they could click send. I'm not sure how to implement this:
I don't want to host any kind of emailing system / backend to manage this. IMO it should be entirely client side.
I'd prefer it to be cross platform, so shouldnt rely on a specific email client.
I'd prefer people to type their content in the website. Maybe I can prefill the textarea with some starter text this way.
Perhaps people modify this text area, then upon clicking "send" it asks to connect to their local email app? Open to solutions.
- Look for any extra features a photographer might appreciate on their portfolio website
---

### Inspiration
- https://www.designrush.com/best-designs/websites/trends/best-sports-websites?utm_source=chatgpt.com