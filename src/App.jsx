import { useDispatch, useSelector } from 'react-redux';
import { increment } from './store';

function App() {
  const count = useSelector(state => state.counter.value);
  const dispatch = useDispatch();

  return (
    <div style={{ padding: 20 }}>
      <h1>Счётчик: {count}</h1>
      <button onClick={() => dispatch(increment())}>
        Увеличить
      </button>
    </div>
  );
}

export default App;
