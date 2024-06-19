import { mount } from '@vue/test-utils';
import {describe, it, expect} from "vitest";
import MainContainer from './MainContainer.vue';

describe('MainContainer.vue', () => {
    const wrapper = mount(MainContainer);

    it('renders correctly', () => {
        expect(wrapper.element).toMatchSnapshot();
    });
});