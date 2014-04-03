require 'rubygems'
require 'json'
require 'pp'

json = File.read('RC.log.json');
logs = JSON.parse(json); # {guid: , log: [{"ts": , "th": , "ll": , "cl": , "msg": },...]}

guid        = logs["guid"];
log         = logs['log'];
start_time  = Time.at((logs['log'].first["ts"].to_i/1000).to_i);
end_time    = Time.at((logs['log'].last["ts"].to_i/1000).to_i);
logs_count   = log.count;

th = {};
ll = {};
cl = {};
msg = {};
cl_msg = {};
ll_cl = {};
ll_cl_msg = {};
ll_cl_msg_counter = {};
counter = 1;
log.each do |l|
  counter += 1
  # Group Messages Per Class Per Log Level
  if ll_cl_msg.include?(l["ll"]) # If including the Log level
    if ll_cl_msg[l["ll"]].include?(l["cl"]) # If including the Class
      if ll_cl_msg[l["ll"]][l["cl"]].include?(l["msg"]) # If including the Message
        ll_cl_msg[l["ll"]][l["cl"]][l["msg"]] += 1;
      else
        ll_cl_msg[l["ll"]][l["cl"]][l["msg"]] = 1;
      end
    else
      ll_cl_msg[l["ll"]][l["cl"]] = { [l["msg"]] => 1 };
    end
  else
    ll_cl_msg[l["ll"]] = {l['cl'] => { l["msg"] => 1} };
  end
  
end

# Aggregator
ll_cl_msg.each_pair do |ll, cls|
  count_msgs_per_level = 0;
  ll_cl_msg_counter[ll] = {};
  cls.each_pair do |cl, msgs|
    count_msgs_per_class = 0
    msgs.each_pair do |msg, tot|
      count_msgs_per_class += tot; 
      count_msgs_per_level += tot;
    end
    ll_cl_msg_counter[ll][cl] = count_msgs_per_class;
  end
  ll_cl_msg_counter[ll]["classes"]  = cls.count;
  ll_cl_msg_counter[ll]["messages"] = count_msgs_per_level;
end

File.open("analysis.js", "w") do |file|
  file.write( "var analysis_data = ");
  file.write({ 
                guid: "7c39ee140600e7f94f0affd5442bf9cd", 
                logs_count: logs_count,
                start_time: start_time,
                end_time: end_time,
                gb_ll_cl_msg: ll_cl_msg,
                ll_cl_msg_counter: ll_cl_msg_counter
                }.to_json )
end