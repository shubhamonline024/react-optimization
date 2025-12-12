/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/purity */
import React, { useState, useCallback, useMemo } from "react";

// Child Component wrapped with React.memo
// This prevents re-renders when props haven't changed
const ExpensiveChild = React.memo(({ todos, addTodos, expensiveData }) => {
  console.log("🔴 ExpensiveChild RENDERED");

  // Simulate expensive rendering operation
  const renderTime = () => {
    const start = performance.now();
    let count = 0;
    for (let i = 0; i < 10_00_000_000; i++) {
      count += 1;
    }
    return (performance.now() - start).toFixed(2);
  };

  const time = renderTime();

  return (
    <div
      style={{
        border: "2px solid #3b82f6",
        padding: "15px",
        marginTop: "20px",
        borderRadius: "8px",
      }}
    >
      <h3>Child Component (wrapped with React.memo)</h3>
      <p style={{ color: "#666", fontSize: "14px" }}>Render time: {time}ms</p>
      <button
        onClick={() => addTodos(`Todo ${todos.length + 1}`)}
        style={{
          padding: "8px 16px",
          backgroundColor: "#3b82f6",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          marginBottom: "10px",
        }}
      >
        Add Todo
      </button>
      <div style={{ marginTop: "10px" }}>
        <strong>Todos:</strong>
        <ul style={{ marginTop: "5px" }}>
          {todos.map((todo, index) => (
            <li key={index}>{todo}</li>
          ))}
        </ul>
      </div>
      <div
        style={{
          marginTop: "10px",
          padding: "10px",
          backgroundColor: "#f0f9ff",
          borderRadius: "4px",
        }}
      >
        <strong>Expensive Computation Result:</strong>
        <p>{expensiveData}</p>
      </div>
    </div>
  );
});

const MemoizationDemo = () => {
  const [todos, setTodos] = useState(["Initial Todo"]);
  const [count, setCount] = useState(0);
  const [number, setNumber] = useState(5);

  console.log("🟢 Parent Component RENDERED");

  // 1. useCallback - Memoizes the function itself
  // Without useCallback, this function would be recreated on every render
  // causing ExpensiveChild to re-render even with React.memo
  const addTodos = useCallback((text) => {
    console.log("✅ addTodos function called");
    setTodos((prev) => [...prev, text]);
  }, []); // Empty dependency array means this function is created only once

  // 2. useMemo - Memoizes the result of an expensive calculation
  // This calculation only runs when 'number' changes
  const expensiveCalculation = useMemo(() => {
    console.log("💡 Running expensive calculation...");
    let result = 0;
    for (let i = 0; i < number * 10_00_000_000; i++) {
      result += i;
    }
    return `Factorial-like sum for ${number}: ${result.toLocaleString()}`;
  }, [number]); // Only recalculate when 'number' changes

  return (
    <div
      style={{
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        maxWidth: "800px",
        margin: "0 auto",
      }}
    >
      <h1>React Memoization Concepts Demo</h1>

      <div
        style={{
          backgroundColor: "#fef3c7",
          padding: "15px",
          borderRadius: "8px",
          marginBottom: "20px",
        }}
      >
        <h3>📚 What's Demonstrated:</h3>
        <ul style={{ lineHeight: "1.8" }}>
          <li>
            <strong>React.memo:</strong> Prevents child re-renders when props
            unchanged
          </li>
          <li>
            <strong>useCallback:</strong> Memoizes function reference (prevents
            recreation)
          </li>
          <li>
            <strong>useMemo:</strong> Memoizes expensive calculation results
          </li>
        </ul>
      </div>

      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "20px",
          flexWrap: "wrap",
        }}
      >
        <button
          onClick={() => setCount((prev) => prev + 1)}
          style={{
            padding: "10px 20px",
            backgroundColor: "#10b981",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          Count: {count} (Click to increment)
        </button>

        <button
          onClick={() => setNumber((prev) => prev + 1)}
          style={{
            padding: "10px 20px",
            backgroundColor: "#f59e0b",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          Number: {number} (Triggers useMemo)
        </button>
      </div>

      <div
        style={{
          backgroundColor: "#f3f4f6",
          padding: "15px",
          borderRadius: "8px",
          marginBottom: "20px",
        }}
      >
        <h3>🔍 Observations:</h3>
        <p style={{ margin: "5px 0", fontSize: "14px" }}>
          • Clicking "Count" button: Parent re-renders, but Child does NOT
          (thanks to React.memo + useCallback)
        </p>
        <p style={{ margin: "5px 0", fontSize: "14px" }}>
          • Clicking "Number" button: Triggers useMemo recalculation, but Child
          still doesn't re-render
        </p>
        <p style={{ margin: "5px 0", fontSize: "14px" }}>
          • Clicking "Add Todo": Both parent and child re-render (props actually
          changed)
        </p>
        <p
          style={{
            margin: "5px 0",
            fontSize: "14px",
            fontWeight: "bold",
            color: "#dc2626",
          }}
        >
          ⚠️ Check browser console to see render logs!
        </p>
      </div>

      <ExpensiveChild
        todos={todos}
        addTodos={addTodos}
        expensiveData={expensiveCalculation}
      />

      <div
        style={{
          marginTop: "30px",
          padding: "15px",
          backgroundColor: "#e0f2fe",
          borderRadius: "8px",
        }}
      >
        <h3>💡 Key Takeaways:</h3>
        <ol style={{ lineHeight: "1.8" }}>
          <li>
            <strong>React.memo</strong> wraps a component to skip re-renders if
            props are the same (shallow comparison)
          </li>
          <li>
            <strong>useCallback</strong> returns memoized function - same
            reference across renders unless dependencies change
          </li>
          <li>
            <strong>useMemo</strong> returns memoized value - recalculates only
            when dependencies change
          </li>
          <li>
            Use these together: React.memo won't work if you pass new function
            references (that's where useCallback helps)
          </li>
        </ol>
      </div>
    </div>
  );
};

export default MemoizationDemo;
