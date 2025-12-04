## Cryptocurrency/Fiat Currency Swap Page

This project is a responsive cryptocurrency/fiat currency swap page built with React and TypeScript.  
It implements a token swap view with input validation, token selection popups, and a mobile-first layout.

## Tech Stack

- **Framework**: React (Create React App)
- **Language**: TypeScript
- **Styling**: CSS with Tailwind CSS utility support
- **Build Tooling**: `react-scripts` (Webpack/Babel under the hood)
- **Testing**: React Testing Library, Jest

## Project Structure

- **`src/`**: Main application source code
  - **`index.tsx`**: React entry point, rendering the root component
  - **`App.tsx`**: Top-level application component
  - **`page/SwapPage.tsx`**: Main swap page layout container
  - **`components/`**: Reusable UI components
    - **`SwapCoin.tsx`**: Core swap widget (source/target selection, inputs, actions)
    - **`SelectPop.tsx`**: Token selector popup for choosing source/target tokens
    - **`TopBar.tsx`**: Top navigation/header
    - **`BottomBar.tsx`**: Bottom navigation/menu bar
  - **`assets/`**:
    - **`icons/`**: SVG icons for tokens, currencies, and menu
    - **`fonts/`**: Custom font files
  - **`utils/assets.json`**: Asset metadata, including `usdValue` used for swap rate display
  - **`utils/tools.js`**: Utility helpers
  - **`test/`**: Unit tests for `App` and `SwapCoin`

## Features

1. **Swap View Matching UI Design**

   - The swap view layout, typography, and icons follow the design assets from the UI Images folder.
   - Includes distinct areas for source token, target token, and swap details.

2. **Responsive Layout (Mobile & Tablet)**

   - Fully responsive swap page.
   - Uses a breakpoint at **430px**:
     - Widths **≤ 430px**: mobile layout.
     - Widths **> 430px**: tablet/desktop-style layout.

3. **Input Validation & Disabled Preview Button**

   - User inputs for swap amount and token selection are validated.
   - The **Preview** button is **disabled** when:
     - The amount is empty, non-numeric, or invalid.
     - The amount exceeds the available balance of the selected source token.
     - The source or target token is not properly selected.

4. **Source & Target Token Selection Popup**

   - Users can choose source and target tokens from a **popup selector**.
   - Popup design aligns with UI assets (token logo, name, symbol, and balance).
   - Selecting a token closes the popup and updates the swap view.

5. **“MAX” Button for Full Balance**

   - A **MAX** button below the amount input sets the value to the **full available balance** of the current source token.
   - This balance comes from the token data (e.g., from `assets.json` or a balance source).

6. **Switch Button to Toggle Tokens**

   - A **central switch button** flips **source** and **target** tokens.
   - After switching, the amount and rate display are recalculated to match the new direction if applicable.

7. **Current Swap Rate Display**
   - The current swap rate is displayed using the **`usdValue`** field from `assets.json`.
   - The UI shows a human-friendly rate, e.g. “1 BTC ≈ X USDC” based on `usdValue`.

## Build & Deploy to Nginx (Overview)

1. **Install Dependencies**

   - Run in the project root:
     - `npm install`

2. **Build for Production**

   - Generate an optimized production build:
     - `npm run build`
   - This creates a static bundle in the `build/` directory.

3. **Copy Build Artifacts to Server**

   - Upload the contents of the local `build/` folder to your server, e.g.:
     - `/var/www/swap-page` (or another web root path on the Nginx host).

4. **Configure Nginx**

   - In your Nginx server block, point the `root` to the copied build directory, for example:
     - `root /var/www/swap-page;`
   - Ensure `index.html` is served as the default index file and static assets under `/static` are accessible.

5. **Reload/Restart Nginx**
   - Test the configuration and reload:
     - `nginx -t`
     - `systemctl reload nginx` (or your environment’s equivalent)
   - Access the application via the configured domain or server IP.
