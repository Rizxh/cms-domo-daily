
import { Center, Image } from "@chakra-ui/react";
import React from 'react';

export default function Logo({ isCollapsed }) {
    return (
        <Center>
            <Image
                src="/icons/domodaily.png"
                alt="DomoDaily Logo"
                w={
                    isCollapsed 
                    ? { base: "20px", md: "20px", lg: "100px", xl: "40px" } // Ukuran lebih kecil saat collapsed
                    : { base: "100px", md: "120px", lg: "180px", xl: "200px" } // Ukuran normal saat tidak collapsed
                }
                transition="all 0.3s ease-in-out" // Tambahkan transisi animasi yang halus
            />
        </Center>
    );
};
