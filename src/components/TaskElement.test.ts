import { shallowMount, mount } from '@vue/test-utils'
import { DateTime } from 'luxon'
import TaskElement from '@/components/TaskElement.vue'
import {describe, it, expect} from "vitest";
import type { Task } from '@/ts/types';

const defaultTask: Task = {
    id: 123,
    created_at: '2020-01-01T00:00:00.000Z',
    timeout: 3600 * 1000,
    name: 'Task 1',
    description: 'Task 1 description',
    message_id: 456,
    roles: ['admin'],
    assigned_to: null,
    ask_later: null,
    declined: null,
    author_id: 1
}

describe('TaskElement.vue', () => {
    it('renders the name of the task', () => {
        const wrapper = shallowMount(TaskElement, {
            propsData: {
                task: defaultTask
            }
        })
        expect(wrapper.find('h2').text()).toBe(defaultTask.name)
    })

    it('renders the assigned user of the task', () => {
        const wrapper = mount(TaskElement, {
            propsData: {
                task: defaultTask,
                admin: true,
                users: []
            }
        })
        expect(wrapper.find('.text-sm').text()).toBe(`Assigned to: N/A`)
    })

    it('emits the dismiss event when the dismiss button is clicked', () => {
        const wrapper = mount(TaskElement, {
            props: {
                task: defaultTask
            }
        })
        wrapper.find('.btn-secondary').trigger('click')
        expect(wrapper.emitted('dismiss')).toBeTruthy()
    })

    it('emits the reactOnTask event when a button is clicked', () => {
        const wrapper = mount(TaskElement, {
            propsData: {
                task: {
                    ...defaultTask,
                    created_at: DateTime.now().toISO(),
                }
            }
        })
        wrapper.find('.btn-success').trigger('click')
        expect(wrapper.emitted().reactOnTask).toBeTruthy()
    })
})