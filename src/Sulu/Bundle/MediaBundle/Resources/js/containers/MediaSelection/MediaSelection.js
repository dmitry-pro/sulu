// @flow
import React from 'react';
import {action, observable} from 'mobx';
import {observer} from 'mobx-react';
import type {FieldTypeProps} from 'sulu-admin-bundle';
import {MultiItemSelection} from 'sulu-admin-bundle/components';
import {translate} from 'sulu-admin-bundle/utils';
import MediaSelectionStore from './stores/MediaSelectionStore';
import MediaSelectionOverlay from './MediaSelectionOverlay';
import MediaSelectionItem from './MediaSelectionItem';
import type {Value} from './types';

const ADD_ICON = 'su-plus';

@observer
export default class MediaSelection extends React.Component<FieldTypeProps<Value>> {
    mediaSelectionStore: MediaSelectionStore;
    @observable overlayOpen: boolean = false;

    componentWillMount() {
        const {
            value,
            locale,
        } = this.props;
        const selectedMediaIds = (value && value.ids) ? value.ids : null;

        if (!locale) {
            throw new Error('The media selection needs a locale to work properly');
        }

        this.mediaSelectionStore = new MediaSelectionStore(selectedMediaIds, locale);
    }

    @action openMediaOverlay() {
        this.overlayOpen = true;
    }

    @action closeMediaOverlay() {
        this.overlayOpen = false;
    }

    callChangeHandler() {
        const {onChange, onFinish} = this.props;

        onChange({
            ids: this.mediaSelectionStore.selectedMediaIds,
        });

        if (onFinish) {
            onFinish();
        }
    }

    getLabel(itemCount: number) {
        if (itemCount === 1) {
            return `1 ${translate('sulu_media.media_selected_singular')}`;
        } else if (itemCount > 1) {
            return `${itemCount} ${translate('sulu_media.media_selected_plural')}`;
        }

        return translate('sulu_media.select_media');
    }

    handleRemove = (mediaId: string | number) => {
        this.mediaSelectionStore.removeById(mediaId);
        this.callChangeHandler();
    };

    handleSorted = (oldItemIndex: number, newItemIndex: number) => {
        this.mediaSelectionStore.move(oldItemIndex, newItemIndex);
        this.callChangeHandler();
    };

    handleOverlayOpen = () => {
        this.openMediaOverlay();
    };

    handleOverlayClose = () => {
        this.closeMediaOverlay();
    };

    handleOverlayConfirm = (selectedMedia: Array<Object>) => {
        selectedMedia.forEach((media) => this.mediaSelectionStore.add(media));
        this.callChangeHandler();
        this.closeMediaOverlay();
    };

    render() {
        const {locale} = this.props;

        if (!locale) {
            throw new Error('The media selection needs a locale to work properly');
        }

        const {
            loading,
            selectedMedia,
            selectedMediaIds,
        } = this.mediaSelectionStore;
        const label = (loading) ? '' : this.getLabel(selectedMedia.length);

        return (
            <div>
                <MultiItemSelection
                    label={label}
                    loading={loading}
                    onItemRemove={this.handleRemove}
                    leftButton={{
                        icon: ADD_ICON,
                        onClick: this.handleOverlayOpen,
                    }}
                    onItemsSorted={this.handleSorted}
                >
                    {selectedMedia.map((selectedMedia, index) => {
                        const {
                            id,
                            title,
                            mimeType,
                            thumbnail,
                        } = selectedMedia;

                        return (
                            <MultiItemSelection.Item
                                key={id}
                                id={id}
                                index={index + 1}
                            >
                                <MediaSelectionItem thumbnail={thumbnail} mimeType={mimeType}>
                                    {title}
                                </MediaSelectionItem>
                            </MultiItemSelection.Item>
                        );
                    })}
                </MultiItemSelection>
                <MediaSelectionOverlay
                    open={this.overlayOpen}
                    locale={locale}
                    excludedIds={selectedMediaIds}
                    onClose={this.handleOverlayClose}
                    onConfirm={this.handleOverlayConfirm}
                />
            </div>
        );
    }
}
