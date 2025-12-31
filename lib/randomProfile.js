export const dynamic = 'force-dynamic';

import fs from "fs/promises";
import path from "path";
import getRandomInt from '@/lib/getRandomInt';

async function getRandomProfilePic() {
    let initialProfilePic;
    
    try {
        const directoryPath = path.join(process.cwd(), "public", "profile-pics");
        const entries = await fs.readdir(directoryPath, { withFileTypes: true });

        const fileNames = entries
            .filter(entry => entry.isFile())
            .map(entry => entry.name);
        const randInt = getRandomInt(0, fileNames.length - 1);
        initialProfilePic = `/profile-pics/${fileNames[randInt]}`;
    } catch (error) {
        initialProfilePic = "/profile-pics/13848365.jpg";
        console.error("Error occured while fetching profile pics!");
    };

    return initialProfilePic;
}

export default getRandomProfilePic;