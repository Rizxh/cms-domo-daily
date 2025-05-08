
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
                    ? { base: "20px", md: "20px", lg: "30px", xl: "40px" } // Ukuran lebih kecil saat collapsed
                    : { base: "40px", md: "40px", lg: "50px", xl: "250px" } // Ukuran normal saat tidak collapsed
                }
                transition="all 0.3s ease-in-out" // Tambahkan transisi animasi yang halus
            />
        </Center>
    );
};
