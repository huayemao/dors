"use client";
import { BaseMessage } from "@shuriken-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle, InfoIcon } from "lucide-react";
import { ComponentProps } from "react";
import { resolveValue, Toaster } from "react-hot-toast";

// export function AppToaster() {
//   return (
//     <Toaster>
//       {(t) => (
//         <AnimatePresence>
//           <motion.div
//             initial={{ scale: 0.75, opacity: 0 }}
//             animate={{ scale: 1, opacity: 1 }}
//             exit={{ scale: 0.6, opacity: 0 }}
//           >
//             <BaseMessage
//               classes={{ wrapper: "z-10" }}
//               // @ts-ignore
//               color={t.type || "default"}
//               // @ts-ignore
//               //   icon={getIcon(t.type)}
//               icon
//             >
//               {resolveValue(t.message, t)}{" "}
//             </BaseMessage>
//           </motion.div>
//         </AnimatePresence>
//       )}
//     </Toaster>
//   );
// }

export function AppToaster() {
  return <Toaster></Toaster>;
}
