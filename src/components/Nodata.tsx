// components/NoData.tsx
"use client";

import { motion } from "framer-motion";
import Image from "next/image";

type NoDataProps = {
  message: string;
  imageSrc: string;
};

export default function NoData({ message, imageSrc }: NoDataProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center text-center"
    >
      <Image src={imageSrc} alt="No Data" width={400} height={400} />
      <p className="mt-4 text-gray-600 text-lg">{message}</p>
    </motion.div>
  );
}
