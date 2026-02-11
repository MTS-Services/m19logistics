# Loading Component - Usage Guide

## Overview

The `Loading` component is a reusable, animated loading indicator with the M19 Logistics logo. It can be used anywhere in your application.

## Installation

The component is located at: `src/components/Loading.jsx`

## Usage Examples

### Basic Usage

```jsx
import Loading from '../../../components/Loading';

function MyComponent() {
  const [loading, setLoading] = useState(true);

  return <div>{loading && <Loading />}</div>;
}
```

### With Custom Message

```jsx
<Loading message="Loading Deliveries..." submessage="Fetching your delivery data" />
```

### Different Sizes

```jsx
{
  /* Large size (default) */
}
<Loading size="large" />;

{
  /* Medium size */
}
<Loading size="medium" message="Processing..." />;

{
  /* Small size */
}
<Loading size="small" message="Loading..." />;
```

### Without Submessage

```jsx
<Loading message="Please wait..." submessage={null} />
```

## Props

| Prop         | Type   | Default                                | Description                                              |
| ------------ | ------ | -------------------------------------- | -------------------------------------------------------- |
| `message`    | string | "Loading..."                           | Main loading message                                     |
| `submessage` | string | "Please wait while we fetch your data" | Secondary message (can be null)                          |
| `size`       | string | "large"                                | Size of loading indicator: "small", "medium", or "large" |

## Features

### Animations

- **Spinning outer ring**: Rotates continuously
- **Pulsing middle ring**: Breathing effect
- **Bouncing logo**: Smooth vertical bounce
- **Pulsing text**: Fade in/out effect
- **Animated dots**: Staggered bounce effect

### Responsive

The component automatically adjusts based on the size prop.

## Examples in Different Pages

### In Invoices Page

```jsx
{
  loading && (
    <Loading
      message="Loading Invoices..."
      submessage="Please wait while we fetch your data"
      size="large"
    />
  );
}
```

### In Deliveries Page

```jsx
{
  isLoading && (
    <Loading
      message="Loading Deliveries..."
      submessage="Fetching delivery information"
      size="medium"
    />
  );
}
```

### In Profile Page

```jsx
{
  fetching && <Loading message="Updating Profile..." size="small" />;
}
```

### In Modal/Dialog

```jsx
<Modal>
  {processing && (
    <Loading message="Processing..." submessage="This may take a moment" size="medium" />
  )}
</Modal>
```

## Styling

The component uses Tailwind CSS classes and includes:

- Gradient background (white to light gray)
- Border with shadow
- Teal color scheme
- Responsive padding based on size

## Customization

To modify the logo or colors:

1. Change logo path in `src/components/Loading.jsx`
2. Update color classes (currently using `teal-*`)
3. Adjust animation speeds in the component or CSS

## Best Practices

1. Use `size="large"` for full-page loading states
2. Use `size="medium"` for section loading
3. Use `size="small"` for inline or button loading
4. Provide clear, specific messages
5. Keep submessages concise
