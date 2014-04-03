require 'pp'
require 'json'

def parse(fn)
  re = /^(\d{13})\s+\[(\S+)\]\s+(\S+)\s+(\S+)\s+(\S+)\s+(.*$)/
  #re = /^\d{13}\s+\S+\s+\S+\s+\S+\s+\S+.*$/
  lines = []
  File.open(fn).each_line do |x|
    a = re.match x
    if a
      ts, thread, loglevel, klass, _, msg = a.captures
      lines << {
        ts: ts,
        th: thread,
        ll: loglevel,
        cl: klass,
        msg: msg.gsub("\r", "")
      }
    else
      lines[-1][:msg] << x.gsub("\r", "")
    end
  end

  File.open("#{fn}.json", "w") do |file|
    file.write( { guid: "7c39ee140600e7f94f0affd5442bf9cd", log: lines }.to_json )
  end
end



ARGV.each do |fn|
  parse fn
end
