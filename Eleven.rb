class  DataStorageManager
  attr_accessor :data

  def initialize
    @data=[]
  end

  def init(file_path)
    file=File.open(file_path,"r")
    file.each_line do|line|
        line.split(/[\W_]+/).each do |word|
          self.data.push(word.downcase)
        end
    end
    self.data.delete_if {|element| element.length == 0 || "s"==element }
  end

  def words
    self.data
  end
end

class StopWordManager
  attr_accessor :stop_words

  def initialize
    @stop_words=[]
  end

  def init
    stop_words_file=File.open("stop-words.txt","r")
    stop_words_file.each_line do |line|
      line.split(",").each do |stop_word|
        self.stop_words.push(stop_word.downcase)
      end
    end
  end

  def is_stop_word(word)
    self.stop_words.include?word
  end
end

class WordFrequencyManager
  attr_accessor :word_frequencies

  def initialize
    @word_frequencies={}
  end

  def increment_count(word)
    if self.word_frequencies.has_key?(word)
      self.word_frequencies[word]+=1
    else
      self.word_frequencies[word]=1;
    end
  end

  def sorted
    self.word_frequencies.sort_by {|key,value|value}.reverse.first(25).to_h
  end
end

class WordFrequencyController
  attr_accessor :data_storage_manager,:stop_word_manager,:word_frequency_manager
  def init(book_file_path)
    self.data_storage_manager=DataStorageManager.new
    self.stop_word_manager=StopWordManager.new
    self.word_frequency_manager=WordFrequencyManager.new
    self.data_storage_manager.send(:init,book_file_path)
    self.stop_word_manager.send(:init)
  end

  def run
    self.data_storage_manager.send(:words).each do |word|
      if !self.stop_word_manager.send(:is_stop_word,word)
        self.word_frequency_manager.send(:increment_count,word)
      end
    end
    word_frequencies=self.word_frequency_manager.send(:sorted)
    word_frequencies.each_pair{|key,value| puts "#{key}-#{value}"}
    end

  end

controller=WordFrequencyController.new
controller.send(:init,ARGV[0])
controller.send(:run)