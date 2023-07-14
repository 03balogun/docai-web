import {Bot} from "~/types/global";
import {useBotsStore} from "~/store/bots";

export const useDeleteBot = async (bot: Bot) => {
    const { deleteBot } = useBotsStore();

    const confirmed = confirm(`Are you sure to delete "${bot.name}"?`)

    if (confirmed) {
        useNuxtApp().$toast.promise(
            deleteBot(bot.id).finally(() => {
            }),
            {
                pending: 'Deleting bot...',
                success: 'Bot deleted successfully',
                error: 'Failed to delete bot'
            })
    }
}
