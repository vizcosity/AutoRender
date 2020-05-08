const uuid = require('uuid-random');
const path = require('path');

const _DEFAULT_ACTION_ENCODE_TEMPLATE = {
    "module": "@nexrender/action-encode",
    // "module": path.resolve(__dirname, '../../modules/nexrender-action-encode'),
    "output": "foobar.mp4",
    "preset": "mp4",
    "params": {"-vcodec": "libx264", "-r": 25}
};

const _DEFAULT_ACTION_COPY_TEMPLATE = {
    "module": "@nexrender/action-copy",
    "output": "foo.bar"
}

const createCopyAction = ({
    outputName="untitled_output_"+uuid().split('-')[0]+".mp4",
}: {
    outputName: string
}) => {
    return {
        ..._DEFAULT_ACTION_COPY_TEMPLATE,
        output: outputName
    }
}

const createEncodeAction = (
    {
        outputName="untitled_output_"+uuid().split('-')[0]+".mp4", 
        preset="mp4", 
        framerate=29.97, 
        params
    }: 
    {
        outputName: string, 
        preset: string, 
        framerate: number, 
        params: any
    }) => {
    return {
        ..._DEFAULT_ACTION_ENCODE_TEMPLATE,
        output: outputName + ".mp4",
        preset,
        params: {
            ..._DEFAULT_ACTION_ENCODE_TEMPLATE.params,
            "-r": framerate,
            ...params
        }
    }
};

module.exports = {
    createCopyAction,
    createEncodeAction
}