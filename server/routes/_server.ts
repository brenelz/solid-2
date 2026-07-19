import { defineHandler } from 'nitro'
import { handleServerFunctionRequest } from 'virtual:solid-server-function-handler'

export default defineHandler(event => handleServerFunctionRequest(event.req))
