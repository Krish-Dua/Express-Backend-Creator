# Express Backend Generator (`create-exp-node-app`)

Scaffold a production-ready Express backend in seconds! Instead of starting from scratch and spending hours setting up folder structures, connecting databases, and writing error handlers, `create-exp-node-app` does it all for you so you can focus on building your features immediately.

---

## What's Inside? (It's not just empty folders!)

The generated project comes pre-configured with industry-standard boilerplates. You don't get empty directories—you get a fully functional, running backend:
- 🛡️ **Middlewares**: Custom built-in handlers for **Error Handling** and **404 Not Found** routes.
- 🗄️ **Database Ready**: Pre-written connection utilities for MongoDB (using Mongoose) that read directly from environment variables.
- ⚙️ **Configured Environment**: Ready-to-go `.env` and `.env.sample` setup.
- 🛠️ **Utility Folders**: Pre-structured `controllers`, `models`, `routes`, and `utils` folders following production best practices.

---

## How to Use
> **No global install needed!** You don't even need to download this locally. Just run it with `npx` and you're good to go!

Choose the command that fits your needs:

### 1. Specify a Project Name
Create a new folder and scaffold the project inside it:
```bash
npx create-exp-node-app my-app
```

### 2. Scaffold in the Current Directory
If you are already inside the folder you want to use, use a dot (`.`):
```bash
npx create-exp-node-app .
```
*(This will automatically name the project after your current directory)*

### 3. Let the Prompts Guide You
Simply run the command without any arguments:
```bash
npx create-exp-node-app
```
The CLI will ask you for a project name interactively.

---

## The Interactive Setup

After starting the tool, it will ask you a few simple questions:
1. **Source Code Location**: Put your source code inside a structured `src/` folder or keep it directly in the project `root`.
2. **Database Choice**: Choose whether to pre-configure **MongoDB** (with Mongoose connection helper) or start with **None**.
3. **Post-Setup Action**: Decide if you want the tool to automatically install dependencies and start the nodemon dev server for you, or if you want to run it manually later.

---

## Running Your Server

Once the scaffolding is complete, you can get the server running instantly:
- **If you selected "Install dependencies & start development server"**:
  The server will launch automatically! No action needed.

- **If you selected "Install dependencies only"**:
  ```bash
  $ cd my-app
  $ npm run dev
  ```

- **If you selected "I'll do it myself"**:
  ```bash
  $ cd my-app
  $ npm install
  $ npm run dev
  ```

---

## Local Development (For Contributors)

If you want to modify this generator or test it locally:

1. Clone this repository and run `npm install`.
2. Link the command globally:
   ```bash
   npm link
   ```
3. Test your edits:
   ```bash
   create-exp-node-app my-test-app
   ```
4. Unlink when done:
   ```bash
   npm unlink
   ```

---

## License

ISC License. Feel free to modify, customize, and share!
