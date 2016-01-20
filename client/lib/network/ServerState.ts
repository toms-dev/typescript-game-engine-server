
import {CommandResponse} from "../commands/Command";

// TODO: merge with interface from server
interface ServerState {
	world: any[]
	commandResponses: CommandResponse[],
	leaderBoard: any[]
}

export default ServerState;
