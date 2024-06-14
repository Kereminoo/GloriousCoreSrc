import { DisplayOption } from './display-option';

export const MultimediaOptionsWin: DisplayOption[] = [
    new DisplayOption('none', 'Option_MultimediaOptions_none', -1, { translationFallback: 'none' }),
    new DisplayOption('openMediaPlayer', 'Option_MultimediaOptions_openMediaPlayer', 1, {
        translationFallback: 'Open Media Player',
        bindingValue: 'Multimedia_Fun_0',
    }),
    new DisplayOption('playPause', 'Option_MultimediaOptions_playPause', 2, {
        translationFallback: 'Play / Pause',
        bindingValue: 'Multimedia_Fun_1',
    }),
    new DisplayOption('next', 'Option_MultimediaOptions_next', 3, {
        translationFallback: 'Next',
        bindingValue: 'Multimedia_Fun_2',
    }),
    new DisplayOption('previous', 'Option_MultimediaOptions_previous', 4, {
        translationFallback: 'Previous',
        bindingValue: 'Multimedia_Fun_3',
    }),
    new DisplayOption('stop', 'Option_MultimediaOptions_stop', 5, {
        translationFallback: 'Stop',
        bindingValue: 'Multimedia_Fun_4',
    }),
    new DisplayOption('mute', 'Option_MultimediaOptions_mute', 6, {
        translationFallback: 'Mute',
        bindingValue: 'Multimedia_Fun_5',
    }),
    new DisplayOption('volumeUp', 'Option_MultimediaOptions_volumeUp', 7, {
        translationFallback: 'Volume Up',
        bindingValue: 'Multimedia_Fun_6',
    }),
    new DisplayOption('volumeDown', 'Option_MultimediaOptions_volumeDown', 8, {
        translationFallback: 'Volume Down',
        bindingValue: 'Multimedia_Fun_7',
    }),
    new DisplayOption('nextTrack', 'Option_MultimediaOptions_nextTrack', 9, {
        translationFallback: 'Next Track',
        bindingValue: 'Multimedia_Fun_8',
    }),
    new DisplayOption('previousTrack', 'Option_MultimediaOptions_previousTrack', 10, {
        translationFallback: 'Previous Track',
        bindingValue: 'Multimedia_Fun_9',
    }),
];

export const MultimediaOptionsMac: DisplayOption[] = [
    new DisplayOption('none', 'Option_MultimediaOptions_none', -1, { translationFallback: 'none' }),
    new DisplayOption('playPause', 'Option_MultimediaOptions_playPause', 2, {
        translationFallback: 'Play / Pause',
        bindingValue: 'Multimedia_Fun_1',
    }),
    new DisplayOption('next', 'Option_MultimediaOptions_next', 3, {
        translationFallback: 'Next',
        bindingValue: 'Multimedia_Fun_2',
    }),
    new DisplayOption('previous', 'Option_MultimediaOptions_previous', 4, {
        translationFallback: 'Previous',
        bindingValue: 'Multimedia_Fun_3',
    }),
    new DisplayOption('mute', 'Option_MultimediaOptions_mute', 6, {
        translationFallback: 'Mute',
        bindingValue: 'Multimedia_Fun_5',
    }),
    new DisplayOption('volumeUp', 'Option_MultimediaOptions_volumeUp', 7, {
        translationFallback: 'Volume Up',
        bindingValue: 'Multimedia_Fun_6',
    }),
    new DisplayOption('volumeDown', 'Option_MultimediaOptions_volumeDown', 8, {
        translationFallback: 'Volume Down',
        bindingValue: 'Multimedia_Fun_7',
    }),
    new DisplayOption('nextTrack', 'Option_MultimediaOptions_nextTrack', 9, {
        translationFallback: 'Next Track',
        bindingValue: 'Multimedia_Fun_8',
    }),
    new DisplayOption('previousTrack', 'Option_MultimediaOptions_previousTrack', 10, {
        translationFallback: 'Previous Track',
        bindingValue: 'Multimedia_Fun_9',
    }),
];

export const MultimediaOptions = window.electron.process.platform === 'darwin'
    ? MultimediaOptionsMac
    : MultimediaOptionsWin;
