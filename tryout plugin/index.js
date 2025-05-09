import $ from "jquery";

export default function RotatedTextShape(options) {
  const defaults = {
    selector: "#rotated-text",
    text: "Sample Text",
    angle: 45,
    padding: 10,
    margin: 10,
    fontSize: 16,
    fontFamily: "Arial",
  };
  const settings = { ...defaults, ...options };

  const $container = $(settings.selector);
  if (!$container.length) {
    console.error("Container not found");
    return;
  }

  // Apply styles to container
  $container.css({
    position: "relative",
    margin: `${settings.margin}px`,
    transform: `rotate(${settings.angle}deg)`,
    transformOrigin: "center center",
    overflow: "visible",
  });

  // Create a canvas for text measurement
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  ctx.font = `${settings.fontSize}px ${settings.fontFamily}`;

  // Get container dimensions
  const computedStyle = window.getComputedStyle($container[0]);
  const width = parseFloat(computedStyle.width) || 200;
  const height = parseFloat(computedStyle.height) || 100;

  // Clear existing content
  $container.empty();

  // Calculate rotated rectangle boundaries
  const rad = (settings.angle * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);

  // Four corners of the rectangle before rotation
  const corners = [
    { x: 0, y: 0 },
    { x: width, y: 0 },
    { x: width, y: height },
    { x: 0, y: height },
  ];

  // Rotate corners around center
  const centerX = width / 2;
  const centerY = height / 2;
  const rotatedCorners = corners.map((corner) => {
    const x = corner.x - centerX;
    const y = corner.y - centerY;
    return {
      x: centerX + (x * cos - y * sin),
      y: centerY + (x * sin + y * cos),
    };
  });

  // Find bounding box of rotated rectangle
  const minX = Math.min(...rotatedCorners.map((c) => c.x));
  const maxX = Math.max(...rotatedCorners.map((c) => c.x));
  const minY = Math.min(...rotatedCorners.map((c) => c.y));
  const maxY = Math.max(...rotatedCorners.map((c) => c.y));

  // Adjust container size to fit rotated content
  $container.css({
    width: `${maxX - minX}px`,
    height: `${maxY - minY}px`,
  });

  // Function to check if a point is inside the rotated rectangle
  function isPointInside(x, y) {
    // Translate to center
    const tx = x - centerX;
    const ty = y - centerY;
    // Rotate back
    const rx = tx * cos + ty * sin;
    const ry = -tx * sin + ty * cos;
    // Check if within original rectangle
    return rx >= 0 && rx <= width && ry >= 0 && ry <= height;
  }

  // Place text characters
  const chars = settings.text.split("");
  let currentX = settings.padding;
  let currentY = settings.padding;
  const lineHeight = settings.fontSize * 1.2;

  chars.forEach((char, index) => {
    if (char === " ") char = "\u00A0"; // Non-breaking space
    const metrics = ctx.measureText(char);
    const charWidth = metrics.width;

    // Check if character fits in current line
    if (currentX + charWidth > width - settings.padding) {
      currentX = settings.padding;
      currentY += lineHeight;
    }

    // Check if position is within rotated boundaries
    if (
      isPointInside(currentX, currentY) &&
      currentY < height - settings.padding
    ) {
      const $span = $("<span>")
        .text(char)
        .css({
          position: "absolute",
          left: `${currentX}px`,
          top: `${currentY}px`,
          fontSize: `${settings.fontSize}px`,
          fontFamily: settings.fontFamily,
        });
      $container.append($span);
    }

    currentX += charWidth;
  });

  // Method to get boundary points for external elements
  this.getBoundaries = () => {
    return rotatedCorners;
  };

  // Method to check if an external point is colliding with the rotated div
  this.isColliding = (x, y) => {
    return isPointInside(x, y);
  };
}
