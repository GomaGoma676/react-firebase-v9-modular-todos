import React, { useState, useEffect } from "react";
import styles from "./App.module.css";
import { FormControl, List, TextField } from "@material-ui/core";
import AddToPhotosIcon from "@material-ui/icons/AddToPhotos";
import { makeStyles } from "@material-ui/styles";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import { db, auth } from "./firebase";
import { collection, query, onSnapshot, addDoc } from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import TaskItem from "./TaskItem";

const useStyles = makeStyles({
  field: {
    marginTop: 30,
    marginBottom: 20,
  },
  list: {
    margin: "auto",
    width: "40%",
  },
});
const App: React.FC = (props: any) => {
  const [tasks, setTasks] = useState([{ id: "", title: "" }]);
  const [input, setInput] = useState("");
  const classes = useStyles();

  useEffect(() => {
    const unSub = onAuthStateChanged(auth, (user) => {
      !user && props.history.push("login");
    });
    return () => unSub();
  });

  useEffect(() => {
    const q = query(collection(db, "tasks"));
    const unsub = onSnapshot(q, (querySnapshot) => {
      setTasks(
        querySnapshot.docs.map((doc) => ({
          id: doc.id,
          title: doc.data().title,
        }))
      );
    });
    return () => unsub();
  }, []);

  const newTask = async (e: React.MouseEvent<HTMLButtonElement>) => {
    await addDoc(collection(db, "tasks"), { title: input });
    setInput("");
  };
  return (
    <div className={styles.app__root}>
      <h1>Todo App by React/Firebase</h1>
      <button
        className={styles.app__logout}
        onClick={async () => {
          try {
            await signOut(auth);
            props.history.push("login");
          } catch (error: any) {
            alert(error.message);
          }
        }}
      >
        <ExitToAppIcon />
      </button>
      <br />
      <FormControl>
        <TextField
          className={classes.field}
          InputLabelProps={{
            shrink: true,
          }}
          label="New task ?"
          value={input}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setInput(e.target.value)
          }
        />
      </FormControl>
      <button className={styles.app__icon} disabled={!input} onClick={newTask}>
        <AddToPhotosIcon />
      </button>
      <List className={classes.list}>
        {tasks.map((task) => (
          <TaskItem key={task.id} id={task.id} title={task.title} />
        ))}
      </List>
    </div>
  );
};

export default App;
