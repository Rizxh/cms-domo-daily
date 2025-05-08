import React, { useEffect } from "react";
import Swal from "sweetalert2";

export default function SweetAlert(props) {
    const { alert, handleDelete } = props;

    useEffect(() => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        }).then((result) => {
            if (result.isConfirmed) {
                handleDelete();
                Swal.fire({
                    title: "Deleted!",
                    text: "Data has been deleted.",
                    icon: "success",
                });
            }
        });
    }, [alert]);

    return null;
}