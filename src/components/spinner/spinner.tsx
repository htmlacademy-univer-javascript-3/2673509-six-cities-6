import './spinner.css'; // Подключаем файл со стилями

export function Spinner(): JSX.Element {
  return (
    <div className="spinner-container">
      <div className="spinner">
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
      </div>
      <div className="loading-text">Loading</div>
    </div>
  );
}
