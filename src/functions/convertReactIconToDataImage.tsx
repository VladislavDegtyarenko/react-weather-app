import ReactDOMServer from "react-dom/server";
import { ReactElement } from "react";

/**
 * Converts a React Icon component to a data image.
 * Use this function to draw the icon on an HTML canvas element.
 *
 * @param {ReactElement} ReactIconComponent - The React Icon component.
 * @returns {string} - The data image URL.
 *
 * @example
 * const image = new Image();
 * image.src = convertReactIconToDataImage(<YourReactIconComponent />);
 * yourCanvasContext.drawImage(image, x, y, width, height)
 */

const convertReactIconToDataImage = (ReactIconComponent: ReactElement): string => {
  // Render the React Icon component as an SVG string
  const svgString = ReactDOMServer.renderToString(ReactIconComponent);

  // Create a data URL from the SVG string
  const dataUrl = `data:image/svg+xml;base64,${window.btoa(
    decodeURIComponent(encodeURIComponent(svgString))
  )}`;

  return dataUrl;
};

export default convertReactIconToDataImage;
