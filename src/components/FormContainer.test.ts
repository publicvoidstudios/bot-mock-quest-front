import { mount } from '@vue/test-utils';
import {describe, it, expect} from "vitest";
import FormContainer from './FormContainer.vue';

describe('FormContainer.vue', () => {
    const wrapper = mount(FormContainer);

    it('renders correctly', () => {
        expect(wrapper.element).toMatchSnapshot();
    });

    it('has all necessary classes to be fixed in middle of a screen', () => {
        expect(wrapper.classes()).toContain('fixed');
        expect(wrapper.classes()).toContain('top-1/2');
        expect(wrapper.classes()).toContain('left-1/2');
        expect(wrapper.classes()).toContain('-translate-x-1/2');
        expect(wrapper.classes()).toContain('-translate-y-1/2');
    });
});