const _DEFAULT_OUTPUT_TEMPLATE = {
    "module": "@nexrender/action-encode",
    "output": "foobar.mp4",
    "preset": "mp4",
    "params": {"-vcodec": "libx264", "-r": 25}
};

const createAction = (
    {
        outputName, 
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
        ..._DEFAULT_OUTPUT_TEMPLATE,
        output: outputName,
        preset,
        params: {
            ..._DEFAULT_OUTPUT_TEMPLATE.params,
            "-r": framerate,
            ...params
        }
    }
};

module.exports = {
    createAction
}