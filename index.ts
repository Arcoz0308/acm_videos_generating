import {readdirSync, existsSync} from 'fs'
import Editly from 'editly';
import imageSize from "image-size";
import {cyanBright, green, red, underline, yellow} from 'colorette';

const load = async () => {
    const dirs = readdirSync('./resources/in');
    let i = 0;
    for (const dir of dirs) {

        const files = readdirSync(`./resources/in/${dir}/`);
        const file1 = files.find((n) => n.includes('modifier'));
        const file2 = files.find((n) => !n.includes('modifier'));

        if (!file1 || !file2) {
            console.log(red(`no enough file found in dir ${dir} or not good named`));
            continue;
        }

        const sizes = imageSize(`./resources/in/${dir}/${file1}`);
        if (!sizes.width || !sizes.height) {
            console.log(red(`invalid image size for file ${file1}`));
            continue;
        }

        if (existsSync(`./resources/out/${file2.split('.')[0]}.mp4`)) {
            console.log(yellow(`${cyanBright(file2.split('.')[0])} have already a video generated, continue to next.`));
            continue;
        }

        let height = sizes.height;
        let width = sizes.width;
        if (Math.floor(width/2) !== width/2 || Math.floor(height/2) !== height/2) {
            height *= 2;
            width *=2;
        }

        console.log(green(`start generate video for ${cyanBright(file2.split('.')[0])}`))
        await Editly({
            height: height,
            width: width,
            outPath: `./resources/out/${file2.split('.')[0]}.mp4`,
            clips: [
                {
                    duration: 2,
                    layers: [{
                        type: 'image',
                        path: `./resources/in/${dir}/${file1}`
                    },
                        {
                            type: 'image-overlay',
                            path: './resources/logo.png',
                            position: {
                                originX: 'right',
                                originY: 'bottom',
                                x: 1,
                                y: 1
                            },
                            width: sizes.height > sizes.width ? 0.15 : undefined,
                            height: sizes.height <= sizes.width ? 0.15 : undefined
                        }],
                },
                {
                    duration: 2,
                    layers: [{
                        type: 'image',
                        path: `./resources/in/${dir}/${file2}`
                    }, {
                        type: 'image-overlay',
                        path: './resources/logo.png',
                        position: {
                            originX: 'right',
                            originY: 'bottom',
                            x: 1,
                            y: 1
                        },
                        width: sizes.height > sizes.width ? 0.15 : undefined,
                        height: sizes.height <= sizes.width ? 0.15 : undefined
                    }]
                }
            ],
            defaults: {
                transition: {
                    name: 'fade',
                    duration: 1,
                },
                layerType: {
                    image: {
                        zoomDirection: null
                    }
                }
            },
        });
        i++;
        console.log(green(`generated video for ${cyanBright(file2.split('.')[0])} with success !`));
    }

    console.log(green(underline(`GENERATED ${cyanBright(i)} NEWS VIDEOS !`)));
};
void load();
