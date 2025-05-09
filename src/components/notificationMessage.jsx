import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "../styles/notificationMessage.module.css";

export default function NotificationMessage({title, message}) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false); // Hide after 2 seconds
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 20 }}
          exit={{ opacity: 0, y: -100 }}
          transition={{ duration: 0.8 }}
          style={{
            width: 200,
            height: 50,
            backgroundColor: "#a6d96a",
            zIndex: 999,
            position: "absolute",
            top: 0,
            textAlign: "center",
            lineHeight: "50px",
            fontWeight: "bold",
            borderRadius: 8
          }}
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
