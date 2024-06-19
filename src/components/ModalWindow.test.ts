import {mount, VueWrapper} from '@vue/test-utils';
import {describe, it, expect, beforeEach, afterEach} from "vitest";
import ModalWindow from './ModalWindow.vue';

describe('ModalWindow.vue', () => {
    let wrapper: VueWrapper;
    let visible = true;

    beforeEach(() => {

    })

    afterEach(() => {

    })

    it('renders correctly', () => {
        wrapper = mount(ModalWindow, {props: { visible: true }});
        expect(wrapper.element).toMatchSnapshot();
    });

    it('has container, header, body and footer divs', () => {
        wrapper = mount(ModalWindow, {props: { visible: true }});
        expect(wrapper.element.innerHTML).toContain(`<div class="modal__container">`)
        expect(wrapper.element.innerHTML).toContain(`<div class="modal__header">`)
        expect(wrapper.element.innerHTML).toContain(`<div class="modal__body">`)
        expect(wrapper.element.innerHTML).toContain(`<div class="modal__footer">`)
    })

    it('does not render when prop visible is false', () => {
        wrapper = mount(ModalWindow, {props: { visible: false }});
        expect(wrapper.html()).toEqual(`<!--v-if-->`)
    })

    it('emits toggleModal event when close button is clicked', () => {
        wrapper = mount(ModalWindow, {props: { visible: true }});

        wrapper.find(`.btn-close`).trigger('click')

        expect(wrapper.emitted('toggleModal')).toBeTruthy()
    })

});