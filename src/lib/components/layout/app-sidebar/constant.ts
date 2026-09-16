import Certificate from "phosphor-svelte/lib/Certificate";
import FolderOpen from "phosphor-svelte/lib/FolderOpen";
import Globe from "phosphor-svelte/lib/Globe";
import SignOut from "phosphor-svelte/lib/SignOut";
import SquaresFour from "phosphor-svelte/lib/SquaresFour";

export const nav = [
    {
        title: 'Menu Utama',
        items: [
            {
                title: 'Dashboard',
                url: '/admin',
                icon: SquaresFour
            },
            {
                title: 'Projects',
                url: '/admin/projects',
                icon: FolderOpen
            },
            {
                title: 'Certificates',
                url: '/admin/certificates',
                icon: Certificate
            }
        ]
    },
    {
        title: 'Lainnya',
        items: [
            {
                title: 'Lihat Website',
                url: '/',
                icon: Globe
            },
            {
                title: 'Logout',
                url: '/login',
                icon: SignOut
            }
        ]
    }
]